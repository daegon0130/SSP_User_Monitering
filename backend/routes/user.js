const express = require('express');
const { sequelize } = require('../models');
const { QueryTypes, Op } = require('sequelize');
const schedule = require('node-schedule');
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

const User = require('../models/usr_user');
const UserLog = require('../models/user_log');

// /user 라우터 : 사용자 정보 API , 사용자 추이 API, 미접속 계정 API
const router = express.Router();

let user_org_id_domain;

const get_domain  = (async ()=>{
    user_org_id_domain = (async ()=>{
        const result = await sequelize.query(`
            SELECT 
                DISTINCT(user_org_id) 
            FROM 
                usr_user`, 
        { 
            type: QueryTypes.SELECT
        });
        let res = [];
        for (let el of result){
            res.push(el.user_org_id);
        }
        return res;
    })();
})();

// groupby function
const groupBy = (data, grp) =>{
    console.log(data);
    let result = [];
    for (let i=0; i<data.length; i++){
        let res = { "time": data[i].time};
        const all = JSON.parse(data[i][grp]);
        for (let i in all){
            res[i] = all[i];
        }
        result.push(res);
    }
    return result;
}

const getUserLog = schedule.scheduleJob('0 0 0 * * *', async () => {
    const [{ cnt }]= await User.findAll({
        attributes : [
            [sequelize.fn('COUNT', sequelize.col('user_id')), 'cnt'],
        ],
        raw: true
    });
    console.log(cnt);

    // 그룹별 로그
    const userGroup = await User.findAll({
        attributes : [
            ['user_grp', 'grp'],
            [sequelize.fn('COUNT', sequelize.col('user_id')), 'cnt'],
        ],
        group : 'user_grp',
        raw: true
    });
    let userGroups = {}
    for(let i=0; i<userGroup.length; i++){
        userGroups[userGroup[i].grp] = userGroup[i].cnt;
    }
    console.log(userGroups);

    // 제휴사별 로그
    const userOrg = await User.findAll({
        attributes : [
            ['user_org_id', 'org'],
            [sequelize.fn('COUNT', sequelize.col('user_id')), 'cnt'],
        ],
        group : 'user_org_id',
        raw: true
    });
    let userOrgs = {}
    for(let i=0; i<userOrg.length; i++){
        userOrgs[String(userOrg[i].org).padStart(7, '0')] = userOrg[i].cnt;
    } 
    console.log(userOrgs);
    
    // inactive user
    // 현재 날짜로부터 90일전 날짜 구하기
    let today = new Date();
    today.setDate(today.getDate() - 90);
    const ago90 = today.toISOString().split('T')[0];
    console.log(ago90);
    let [{ inactive_user }] = await sequelize.query(`
        SELECT 
            COUNT(user_id) AS inactive_user 
        FROM 
            usr_user 
        WHERE 
            user_id
            NOT IN (
                        SELECT 
                            DISTINCT user_id 
                        FROM 
                            time_log 
                        WHERE 
                            acs_time > :date
                    );`,
        {
            replacements: { date: ago90 },
            type: QueryTypes.SELECT,
        }
    );
    console.log(typeof inactive_user);
    
    UserLog.create({
        total_num: cnt, 
        adm: userGroups[1], 
        aff: userGroups[2],
        opr: userGroups[3], 
        etc: userGroups[4],
        aff_list: JSON.stringify(userOrgs),
        inactive_user: inactive_user
    });
  });
 
// 회원 정보
router.get('/', async (req, res, next)=>{
    try{
        // 사용자 그룹별 옵션
        //let groups= await sequelize.query('SELECT user_grp AS grp, COUNT(user_id) AS cnt FROM usr_user GROUP BY user_grp;', { type: QueryTypes.SELECT });
        let groups = await User.findAll({
            attributes : [
                ['user_grp', 'grp'],
                [sequelize.fn('COUNT', sequelize.col('user_id')), 'cnt'],
            ],
            group : 'user_grp',
            raw: true
        });
        let group = {}
        for(let i=0; i<groups.length; i++){
            group[groups[i].grp] = groups[i].cnt;
        }

        // 제휴사별 옵션
        //let groups= await sequelize.query('SELECT user_grp AS grp, COUNT(user_id) AS cnt FROM usr_user GROUP BY user_grp;', { type: QueryTypes.SELECT });
        let companies = await User.findAll({
            attributes : [
                ['user_org_id', 'org_id'],
                [sequelize.fn('COUNT', sequelize.col('user_id')), 'cnt'],
            ],
            group : 'user_org_id',
            raw: true
        });
        let company = {}
        for(let i=0; i<companies.length; i++){
            company[String(companies[i].org_id).padStart(7, '0')] = companies[i].cnt;
        }

        // 현재 날짜로부터 90일전 날짜 구하기
        const ago90 = moment().subtract(90, 'days').format('YYYY-MM-DD');
        //const ago90 = today.toISOString().split('T')[0];
        console.log(ago90);
        let [{ inactive_user }] = await sequelize.query(`
            SELECT 
                COUNT(user_id) AS inactive_user 
            FROM 
                usr_user 
            WHERE 
                user_id 
                NOT IN (
                            SELECT 
                                DISTINCT user_id 
                            FROM 
                                time_log 
                            WHERE acs_time > :date
                            
                        );`,
            {
                replacements: { date: ago90 },
                type: QueryTypes.SELECT,
            }
        );
        console.log({
            "result": "success",
            "group" : group,
            "company" : company,
            "inactive_user": inactive_user,
        });
        res.json({
            "result": "success",
            "group" : group,
            "company" : company,
            "inactive_user": inactive_user,
        });
    } catch (err) {
        console.log(err);
        res.json({
            "result": "fail",
            "errMessage": err
        });
        //next(err);
    }
});

// 미접속 계정 조회 API
router.get('/unused', async (req, res, next)=>{
    try{
        let result = await User.findAll({
            attributes : [
                ['user_id', 'id'],
                ['user_grp', 'group'],
                ['user_org_id', 'company'],
                ['recent_acs', 'recent_history'],
                [sequelize.fn('greatest', sequelize.fn('datediff', sequelize.fn("CURDATE") , sequelize.col('recent_acs')), 0), 'inactive_term'],
            ],
            raw: true,
            order : [[sequelize.col('inactive_term'), 'DESC']]
        });
        console.log({
            "result": "success",
            "elements": result,
        });
        res.json({
            "result": "success",
            "elements": result,
        });
    } catch (err) {
        console.log(err);
        res.json({
            "result": "fail",
            "errMessage": err
        });
    }
});

// 사용자 추이 API
router.post('/trends', async (req, res, next)=>{
    try{
        const { startDate, endDate, timeUnit, group }= req.body;
        let trends;
        // no grouping
        if (group === 1){
            console.log(startDate, endDate);
            if (timeUnit === "day"){
                let lastDate = new Date(endDate);
                lastDate.setDate(lastDate.getDate()+1);
                const modEndDate = lastDate.toISOString().split('T')[0];
                trends = await UserLog.findAll({
                    attributes : [
                        [sequelize.fn('date_format', sequelize.col('time'), '%Y-%m-%d'), 'time'],
                        ['total_num', 'all'],
                    ],
                    where: {
                        time :  {
                            [Op.lt]: modEndDate,
                            [Op.gte]: startDate
                        },
                    },
                    raw: true,
                    order: sequelize.col('time'),
                });
            } else if (timeUnit === "week"){
                let lastDate = new Date(endDate);
                const lastDay = lastDate.getDate();
                const dayOfTheWeek = lastDate.getDay(); 
                const newEndDate = lastDate.setDate(lastDay - dayOfTheWeek + 7);
                const modEndDate=new Date(newEndDate).toISOString().split('T')[0];

                let firstDate = new Date(startDate);
                const firstDay = firstDate.getDate();
                const newFirstDate = firstDate.setDate(firstDay - (firstDate.getDay()|| 7));
                const modStartDate = new Date(newFirstDate).toISOString().split('T')[0];
                console.log(modStartDate, modEndDate)
                trends= await sequelize.query(`
                    SELECT 
                        (:startDate + INTERVAL (DATEDIFF(time, :startDate) DIV 7) WEEK) AS "time", 
                        MAX(total_num) AS "all" 
                    FROM 
                        user_log 
                    WHERE 
                        time > :startDate 
                        AND 
                        time < :endDate 
                    GROUP BY 
                        DATEDIFF(time, :startDate) DIV 7 
                    ORDER BY 
                        time;`, 
                { 
                    replacements: { startDate: modStartDate, endDate: modEndDate},
                    type: QueryTypes.SELECT
                });
            } else if (timeUnit === "month"){
                let newEndDate = new Date(endDate);
                newEndDate.setMonth(newEndDate.getMonth() + 1);
                newEndDate = newEndDate.toISOString().split('T')[0];
                let modEndDate = newEndDate.slice(0, 7)+"-01";
                let modStartDate = startDate.slice(0, 7)+ "-01";

                console.log(endDate);
                console.log(modStartDate);
                console.log(modEndDate);
                trends = await UserLog.findAll({
                    attributes : [
                        [sequelize.fn('date_format', sequelize.col('time'), '%Y-%m'), 'time'],
                        [sequelize.fn('max',sequelize.col('total_num')), 'all'],
                    ],
                    where: {
                        [Op.and]:[
                            {
                                time :  {
                                [Op.lt]: modEndDate,
                                [Op.gte]: startDate
                                //[Op.between]: [startDate, modEndDate]
                                },
                            },
                        ]
                    },
                    group: [sequelize.fn('date_format', sequelize.col('time'), '%Y%m')],
                    order: sequelize.col('time'),
                    raw: true
                });
            }else{
                res.json({
                    "result": "fail",
                    "errMessage": "'timeUnit' parameter for trends has value from {hour, day, week, month}"
                });
            }
            console.log({
                result: "success",
                elements: trends
            });
            res.json({
                result: "success",
                elements: trends
            });
            
        // group by 사용자 그룹
        } else if(group === 2){
            console.log(startDate, endDate);
            if (timeUnit === "day"){
                let lastDate = new Date(endDate);
                lastDate.setDate(lastDate.getDate()+1);
                const modEndDate = lastDate.toISOString().split('T')[0];
                trends = await UserLog.findAll({
                    attributes : [
                        [sequelize.fn('date_format', sequelize.col('time'), '%Y-%m-%d'), 'time'],
                        [sequelize.fn('max',sequelize.col('adm')), '1'],
                        [sequelize.fn('max',sequelize.col('aff')), '2'],
                        [sequelize.fn('max',sequelize.col('opr')), '3'],
                        [sequelize.fn('max',sequelize.col('etc')), '4'],
                    ],
                    where: {
                                time :  {
                                [Op.lt]: modEndDate,
                                [Op.gte]: startDate
                                //[Op.between]: [startDate, modEndDate]
                                },
                    },
                    group: [sequelize.fn('date_format', sequelize.col('time'), '%Y%m%d')],
                    order: sequelize.col('time'),
                    raw: true
                });
            } else if (timeUnit === "week"){
                let lastDate = new Date(endDate);
                const lastDay = lastDate.getDate();
                const dayOfTheWeek = lastDate.getDay();
                const newEndDate = lastDate.setDate(lastDay - dayOfTheWeek + 7);
                const modEndDate=new Date(newEndDate).toISOString().split('T')[0];

                let firstDate = new Date(startDate);
                const firstDay = firstDate.getDate();
                const newFirstDate = firstDate.setDate(firstDay - (firstDate.getDay()|| 7));
                const modStartDate = new Date(newFirstDate).toISOString().split('T')[0];
                console.log(modStartDate, modEndDate)
                trends= await sequelize.query(`
                    SELECT 
                        (:startDate + INTERVAL (DATEDIFF(time, :startDate) DIV 7) WEEK) AS "time", 
                        MAX(adm) AS "1", 
                        MAX(aff) AS "2", 
                        MAX(opr) AS "3", 
                        MAX(etc) AS "4" 
                    FROM 
                        user_log 
                    WHERE 
                        time > :startDate 
                        AND 
                        time < :endDate 
                    GROUP BY 
                        DATEDIFF(time, :startDate) DIV 7 
                    ORDER BY 
                        time;`, 
                { 
                    replacements: { startDate: modStartDate, endDate: modEndDate},
                    type: QueryTypes.SELECT
                });
            } else if (timeUnit === "month"){
                let newEndDate = new Date(endDate);
                newEndDate.setMonth(newEndDate.getMonth() + 1);
                newEndDate = newEndDate.toISOString().split('T')[0];
                let modEndDate = newEndDate.slice(0, 7)+"-01";
                let modStartDate = startDate.slice(0, 7)+ "-01";

                console.log(endDate);
                console.log(modStartDate);
                console.log(modEndDate);
                trends = await UserLog.findAll({
                    attributes : [
                        [sequelize.fn('date_format', sequelize.col('time'), '%Y-%m'), 'time'],
                        [sequelize.fn('max',sequelize.col('adm')), '1'],
                        [sequelize.fn('max',sequelize.col('aff')), '2'],
                        [sequelize.fn('max',sequelize.col('opr')), '3'],
                        [sequelize.fn('max',sequelize.col('etc')), '4'],
                    ],
                    where: {
                        [Op.and]:[
                            {
                                time :  {
                                [Op.lt]: modEndDate,
                                [Op.gt]: startDate
                                //[Op.between]: [startDate, modEndDate]
                                },
                            },
                        ]
                    },
                    group: [sequelize.fn('date_format', sequelize.col('time'), '%Y%m')],
                    order: sequelize.col('time'),
                    raw: true
                });
            }else{
                res.json({
                    "result": "fail",
                    "errMessage": "'timeUnit' parameter for trends has value from {hour, day, week, month}"
                });
            }
            console.log({
                result: "success",
                elements: trends
            });
            res.json({
                result: "success",
                elements: trends
            });
            
        // group by 제휴사 
        } else if(group === 3){
            console.log(startDate, endDate);
            if (timeUnit === "day"){
                let lastDate = new Date(endDate);
                lastDate.setDate(lastDate.getDate()+1);
                const modEndDate = lastDate.toISOString().split('T')[0];
                trends = await UserLog.findAll({
                    attributes : [
                        [sequelize.fn('date_format', sequelize.col('time'), '%Y-%m-%d'), 'time'],
                        ['aff_list', 'all'],
                    ],
                    where: {
                        time :  {
                            [Op.lt]: modEndDate,
                            [Op.gte]: startDate
                        },
                    },
                    order: sequelize.col('time'),
                    raw: true
                });
            } else if (timeUnit === "week"){
                let lastDate = new Date(endDate);
                const lastDay = lastDate.getDate();
                const dayOfTheWeek = lastDate.getDay();
                const newEndDate = lastDate.setDate(lastDay - dayOfTheWeek + 7);
                const modEndDate=new Date(newEndDate).toISOString().split('T')[0];

                let firstDate = new Date(startDate);
                const firstDay = firstDate.getDate();
                const newFirstDate = firstDate.setDate(firstDay - (firstDate.getDay()|| 7));
                const modStartDate = new Date(newFirstDate).toISOString().split('T')[0];
                console.log(modStartDate, modEndDate)
                trends= await sequelize.query(`
                    SELECT 
                        (:startDate + INTERVAL (DATEDIFF(time, :startDate) DIV 7) WEEK) AS "time", 
                        aff_list AS "all" 
                    FROM 
                        user_log 
                    WHERE 
                        time > :startDate 
                        AND 
                        time < :endDate 
                    GROUP BY 
                        DATEDIFF(time, :startDate) DIV 7 
                    ORDER BY 
                        time;`, 
                { 
                    replacements: { startDate: modStartDate, endDate: modEndDate},
                    type: QueryTypes.SELECT
                });
            } else if (timeUnit === "month"){
                let newEndDate = new Date(endDate);
                newEndDate.setMonth(newEndDate.getMonth() + 1);
                newEndDate = newEndDate.toISOString().split('T')[0];
                let modEndDate = newEndDate.slice(0, 7)+"-01";
                let modStartDate = startDate.slice(0, 7)+ "-01";

                console.log(endDate);
                console.log(modStartDate);
                console.log(modEndDate);
                trends = await UserLog.findAll({
                    attributes : [
                        [sequelize.fn('date_format', sequelize.col('time'), '%Y-%m'), 'time'],
                        ['aff_list', 'all'],
                    ],
                    where: {
                        [Op.and]:[
                            {   
                                time :  {
                                [Op.lt]: modEndDate,
                                [Op.gte]: modStartDate
                                }
                            }
                            //sequelize.where(sequelize.fn('date_format', sequelize.col('time'), '%d'),1)
                        ]
                    },
                    group: [sequelize.fn('date_format', sequelize.col('time'), '%Y%m')],
                    order: sequelize.col('time'),
                    raw: true
                });
            }else{
                res.json({
                    "result": "fail",
                    "errMessage": "'timeUnit' parameter for trends has value from {hour, day, week, month}"
                });
            }
            trends = groupBy(trends, 'all');
            console.log({
                result: "success",
                elements: trends
            });
            res.json({
                result: "success",
                elements: trends
            });

        // 미접속 계정
        } else if(group === 4){
            console.log(startDate, endDate);
            if (timeUnit === "day"){
                let lastDate = new Date(endDate);
                lastDate.setDate(lastDate.getDate()+1);
                const modEndDate = lastDate.toISOString().split('T')[0];
                trends = await UserLog.findAll({
                    attributes : [
                        [sequelize.fn('date_format', sequelize.col('time'), '%Y-%m-%d'), 'time'],
                        ['aff_list', 'all'],
                    ],
                    where: {
                        time :  {
                            [Op.lt]: modEndDate,
                            [Op.gt]: startDate
                        },
                    },
                    raw: true,
                    order: sequelize.col('time'),
                });
            } else if (timeUnit === "week"){
                let lastDate = new Date(endDate);
                const lastDay = lastDate.getDate();
                const dayOfTheWeek = lastDate.getDay();
                const newEndDate = lastDate.setDate(lastDay - dayOfTheWeek + 7);
                const modEndDate=new Date(newEndDate).toISOString().split('T')[0];

                let firstDate = new Date(startDate);
                const firstDay = firstDate.getDate();
                const newFirstDate = firstDate.setDate(firstDay - (firstDate.getDay()|| 7));
                const modStartDate = new Date(newFirstDate).toISOString().split('T')[0];
                console.log(modStartDate, modEndDate)
                trends= await sequelize.query(`
                    SELECT 
                        (:startDate + INTERVAL (DATEDIFF(time, :startDate) DIV 7) WEEK) AS "time", 
                        aff_list AS "all" 
                    FROM 
                        user_log 
                    WHERE 
                        time > :startDate 
                        AND 
                        time < :endDate 
                    GROUP BY 
                        DATEDIFF(time, :startDate) DIV 7 
                    ORDER BY 
                        time;`, 
                { 
                    replacements: { startDate: modStartDate, endDate: modEndDate},
                    type: QueryTypes.SELECT
                });
            } else if (timeUnit === "month"){
                let newEndDate = new Date(endDate);
                newEndDate.setMonth(newEndDate.getMonth() + 1);
                newEndDate = newEndDate.toISOString().split('T')[0];
                let modEndDate = newEndDate.slice(0, 7)+"-01";
                let modStartDate = startDate.slice(0, 7)+ "-01";

                console.log(endDate);
                console.log(modStartDate);
                console.log(modEndDate);
                trends = await UserLog.findAll({
                    attributes : [
                        [sequelize.fn('date_format', sequelize.col('time'), '%Y-%m'), 'time'],
                        ['aff_list', 'all'],
                    ],
                    where: {
                        [Op.and]:[
                            {   
                                time :  {
                                [Op.lt]: modEndDate,
                                [Op.gte]: modStartDate
                                }
                            }
                            //sequelize.where(sequelize.fn('date_format', sequelize.col('time'), '%d'),1)
                        ]
                    },
                    group: [sequelize.fn('date_format', sequelize.col('time'), '%Y%m')],
                    order: sequelize.col('time'),
                    raw: true
                });
            }else{
                res.json({
                    "result": "fail",
                    "errMessage": "'timeUnit' parameter for trends has value from {hour, day, week, month}"
                });
            }
            trends = groupBy(trends, 'all');
            console.log({
                result: "success",
                elements: trends
            });
            res.json({
                result: "success",
                elements: trends
            });
        }
        else{
            res.json({
                "result": "fail",
                "errMessage": "'group' parameter for trends has value 1 to 3"
            });
        }
    } catch (err) {
        console.log(err);
        res.json({
            "result": "fail",
            "errMessage": err
        });
        //next(err);
    }
});


module.exports = router;