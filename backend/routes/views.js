const express = require('express');
const { sequelize } = require('../models');
const { QueryTypes, Op, DatabaseError } = require('sequelize');
const { User, TimeLog } = require('../models');
const schedule = require('node-schedule');
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

const router = express.Router();

let user_grp_domain, user_org_id_domain, page_domain;
// 사용자 그룹 값 도메인, 제휴사 아이디 도메인, 페이지 도메인 값 저장
const get_domain_ = (async () => {
    user_grp_domain = await (async ()=>{
        const result = await sequelize.query('SELECT DISTINCT(user_grp) FROM usr_user', 
                    { 
                        type: QueryTypes.SELECT
                    });
        let res = [];
        for (let el of result){
            res.push(el.user_grp);
        }
        console.log("사용자 그룹 아이디 domain:", res);
        return res;
    })();
    user_org_id_domain = await (async ()=>{
        const result = await sequelize.query('SELECT DISTINCT(user_org_id) FROM usr_user', 
                    { 
                        type: QueryTypes.SELECT
                    });
        let res = [];
        for (let el of result){
            res.push(el.user_org_id);
        }
        console.log("제휴사 아이디 domain:", res);
        return res;
    })();
    page_domain = await (async ()=>{
        const result = await sequelize.query('SELECT DISTINCT(page) FROM time_log', 
                    { 
                        type: QueryTypes.SELECT
                    });
        let res = [];
        for (let el of result){
            res.push(el.page);
        }
        console.log("페이지 아이디 domain:", res);
        return res;
    })();
})();
// 매일 00시 00분에 사용자 그룹 아이딛 도메인, 제휴사 아이디 도메인, 페이지 도메인 저장
const get_domain = schedule.scheduleJob('0 0 0 * * *', async () => {
    user_grp_domain = await (async ()=>{
        const result = await sequelize.query('SELECT DISTINCT(user_grp) FROM usr_user', 
                    { 
                        type: QueryTypes.SELECT
                    });
        let res = [];
        for (let el of result){
            res.push(el.user_grp);
        }
        console.log(res);
        return res;
    })();
    user_org_id_domain = await (async ()=>{
        const result = await sequelize.query('SELECT DISTINCT(user_org_id) FROM usr_user', 
                    { 
                        type: QueryTypes.SELECT
                    });
        let res = [];
        for (let el of result){
            res.push(el.user_org_id);
        }
        console.log(res);
        return res;
    })();
    page_domain = await (async ()=>{
        const result = await sequelize.query('SELECT DISTINCT(page) FROM time_log', 
                    { 
                        type: QueryTypes.SELECT
                    });
        let res = [];
        for (let el of result){
            res.push(el.page);
        }
        console.log(res);
        return res;
    })();
});

// groupby function -> db 결과값을 api 응답 형태로 변환
const groupBy = function (data, key, grp) {
    const sol = data.reduce((carry, el) =>{
        let group = el[key];                    
        if (carry[group] === undefined) {
            carry[group] = {};
            carry[group].time = el[key];
            if (grp==='user_grp'){
                for (let ele of user_grp_domain){
                    carry[group][ele] = 0;
                }
            }else if (grp==='user_org_id'){
                console.log(user_org_id_domain);
                for (let ele of user_org_id_domain){
                    carry[group][ele] = 0;
                }
            }else {
                for (let ele of page_domain){
                    carry[group][ele] = 0;
                }
            }
        }
        carry[group][el[grp]] = el.all;
        return carry;
    }, {});
    return Object.values(sol);
}

// UV 라우터
router.post('/uv', async (req, res, next)=>{
    try{
        const { startDate, endDate, timeUnit, group, ratio }= req.body;
        let uv;
        // no grouping
        if (group === 1){
            console.log(startDate, endDate);
            if (timeUnit === "hour"){
                uv= await sequelize.query('SELECT DATE_FORMAT(acs_time, "%Y-%m-%d %H:00:00") AS time, COUNT(DISTINCT(user_id)) AS "all" FROM time_log WHERE acs_time > :startDate AND acs_time < :endDate GROUP BY DATE_FORMAT(acs_time, "%Y-%m-%d %H") ORDER BY time;', 
                { 
                    replacements: { startDate: startDate, endDate: endDate},
                    type: QueryTypes.SELECT
                });
            } else if (timeUnit === "day"){
                let lastDate = new Date(endDate);
                lastDate.setDate(lastDate.getDate()+1);
                const modEndDate = lastDate.toISOString().split('T')[0];
                uv = await TimeLog.findAll({
                    attributes : [
                        [sequelize.fn('date_format', sequelize.col('acs_time'), '%Y-%m-%d'), 'time'],
                        [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('user_id'))), 'all'],
                    ],
                    where: {
                        acs_time :  {
                            [Op.lt]: modEndDate,
                            [Op.gt]: startDate
                        },
                    },
                    group: [sequelize.fn('date_format', sequelize.col('acs_time'), '%Y-%m-%d')],
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
                uv= await sequelize.query('SELECT (:startDate + INTERVAL (DATEDIFF(acs_time, :startDate) DIV 7) WEEK) AS time, COUNT(DISTINCT(user_id)) AS "all" FROM time_log WHERE acs_time > :startDate AND acs_time < :endDate GROUP BY DATEDIFF(acs_time, :startDate) DIV 7;', 
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
                uv= await sequelize.query('SELECT DATE_FORMAT(acs_time, "%Y-%m") AS time, COUNT(DISTINCT(user_id)) AS "all" FROM time_log WHERE acs_time > :startDate AND acs_time < :endDate GROUP BY DATE_FORMAT(acs_time, "%Y%m");',
                {                           
                    replacements: { startDate: modStartDate, endDate: modEndDate},
                    type: QueryTypes.SELECT
                });
            }else{
                res.json({
                    "result": "fail",
                    "errMessage": "'timeUnit' parameter for uv has value from {hour, day, week, month}"
                });
            }
            console.log({
                result: "success",
                elements: uv
            });
            res.json({
                result: "success",
                elements: uv
            });
            
        // group by 사용자 그룹
        } else if(group === 2){
            console.log(startDate, endDate);
            
            if (timeUnit === "hour"){
                uv= await sequelize.query('SELECT DATE_FORMAT(acs_time, "%Y-%m-%d %H:00:00") AS time, user_grp, COUNT(DISTINCT(time_log.user_id)) AS "all" FROM time_log JOIN usr_user ON time_log.user_id = usr_user.user_id WHERE acs_time > :startDate AND acs_time < :endDate GROUP BY DATE_FORMAT(acs_time, "%Y-%m-%d %H"), user_grp ORDER BY time, user_grp;', 
                { 
                    replacements: { startDate: startDate, endDate: endDate},
                    type: QueryTypes.SELECT
                });
            } else if (timeUnit === "day"){
                let lastDate = new Date(endDate);
                lastDate.setDate(lastDate.getDate()+1);
                const modEndDate = lastDate.toISOString().split('T')[0];
                uv= await sequelize.query('SELECT DATE_FORMAT(acs_time, "%Y-%m-%d") AS time, user_grp, COUNT(DISTINCT(time_log.user_id)) AS "all" FROM time_log JOIN usr_user ON time_log.user_id = usr_user.user_id WHERE acs_time > :startDate AND acs_time < :endDate GROUP BY DATE_FORMAT(acs_time, "%Y-%m-%d"), user_grp ORDER BY time, user_grp;', 
                { 
                    replacements: { startDate: startDate, endDate: modEndDate},
                    type: QueryTypes.SELECT
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
                uv= await sequelize.query('SELECT (:startDate + INTERVAL (DATEDIFF(acs_time, :startDate) DIV 7) WEEK) AS time, user_grp, COUNT(DISTINCT(time_log.user_id)) AS "all" FROM time_log JOIN usr_user ON time_log.user_id = usr_user.user_id WHERE acs_time > :startDate AND acs_time < :endDate GROUP BY DATEDIFF(acs_time, :startDate) DIV 7, user_grp ORDER BY time, user_grp;', 
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
                uv= await sequelize.query('SELECT DATE_FORMAT(acs_time, "%Y-%m") AS time, user_grp, COUNT(DISTINCT(time_log.user_id)) as "all" FROM time_log JOIN usr_user ON time_log.user_id = usr_user.user_id WHERE acs_time > :startDate AND acs_time < :endDate GROUP BY DATE_FORMAT(acs_time, "%Y%m"), user_grp ORDER BY time, user_grp;',
                {                           
                    replacements: { startDate: modStartDate, endDate: modEndDate},
                    type: QueryTypes.SELECT
                });
            }else{
                res.json({
                    "result": "fail",
                    "errMessage": "'timeUnit' parameter for uv has value from {hour, day, week, month}"
                });
            }
            uv = groupBy(uv,'time', 'user_grp');
            console.log({
                result: "success",
                elements: uv
            });
            res.json({
                result: "success",
                elements: uv
            });

        // group by 제휴사 
        } else if(group === 3){
            console.log(startDate, endDate);
            
            if (timeUnit === "hour"){
                // let lastDate = new Date(endDate);
                // lastDate.setDate(lastDate.getDate()+1);
                // const modEndDate = lastDate.toISOString().split('T')[0];
                uv= await sequelize.query('SELECT DATE_FORMAT(acs_time, "%Y-%m-%d %H:00:00") AS time, user_org_id, COUNT(DISTINCT(time_log.user_id)) AS "all" FROM time_log JOIN usr_user ON time_log.user_id = usr_user.user_id WHERE acs_time > :startDate AND acs_time < :endDate GROUP BY DATE_FORMAT(acs_time, "%Y-%m-%d %H"), user_org_id ORDER BY time, user_org_id;', 
                { 
                    replacements: { startDate: startDate, endDate: endDate},
                    type: QueryTypes.SELECT
                });
            } else if (timeUnit === "day"){
                let lastDate = new Date(endDate);
                lastDate.setDate(lastDate.getDate()+1);
                const modEndDate = lastDate.toISOString().split('T')[0];
                uv= await sequelize.query('SELECT DATE_FORMAT(acs_time, "%Y-%m-%d") AS time, user_org_id, COUNT(DISTINCT(time_log.user_id)) AS "all" FROM time_log JOIN usr_user ON time_log.user_id = usr_user.user_id WHERE acs_time > :startDate AND acs_time < :endDate GROUP BY DATE_FORMAT(acs_time, "%Y-%m-%d"), user_org_id ORDER BY time, user_org_id;', 
                { 
                    replacements: { startDate: startDate, endDate: modEndDate},
                    type: QueryTypes.SELECT
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
                uv= await sequelize.query('SELECT (:startDate + INTERVAL (DATEDIFF(acs_time, :startDate) DIV 7) WEEK) AS time, user_org_id, COUNT(DISTINCT(time_log.user_id)) AS "all" FROM time_log JOIN usr_user ON time_log.user_id = usr_user.user_id WHERE acs_time > :startDate AND acs_time < :endDate GROUP BY DATEDIFF(acs_time, :startDate) DIV 7, user_org_id ORDER BY time, user_org_id;', 
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
                uv= await sequelize.query('SELECT DATE_FORMAT(acs_time, "%Y-%m") AS time, user_org_id, COUNT(DISTINCT(time_log.user_id)) as "all" FROM time_log JOIN usr_user ON time_log.user_id = usr_user.user_id WHERE acs_time > :startDate AND acs_time < :endDate GROUP BY DATE_FORMAT(acs_time, "%Y%m"), user_org_id ORDER BY time, user_org_id;',
                {                           
                    replacements: { startDate: modStartDate, endDate: modEndDate},
                    type: QueryTypes.SELECT
                });
            }else{
                res.json({
                    "result": "fail",
                    "errMessage": "'timeUnit' parameter for uv has value from {hour, day, week, month}"
                });
            }
            uv = groupBy(uv,'time', 'user_org_id');
            console.log({
                result: "success",
                elements: uv
            });
            res.json({
                result: "success",
                elements: uv
            });
        }
        else{
            res.json({
                "result": "fail",
                "errMessage": "'group' parameter for uv has value 1 to 3"
            });
        }
    } catch (err) {
        console.log(err);
        res.json({
            "result": "fail",
            "errMessage": err
        });
        next(err);
    }
});

// PV 라우터
router.post('/pv', async (req, res, next)=>{
    try{
        const { startDate, endDate, timeUnit, group, ratio }= req.body;
        let pv;
        // no grouping
        if (group === 1){
            console.log(startDate, endDate);
            if (timeUnit === "hour"){
                //let lastDate = new Date(endDate);
                //lastDate.setDate(lastDate.getDate()+1);
                //const modEndDate = lastDate.toISOString().split('T')[0];
                pv= await sequelize.query('SELECT DATE_FORMAT(acs_time, "%Y-%m-%d %H:00:00") AS time, COUNT(*) AS "all" FROM time_log AS A WHERE A.acs_time > :startDate AND A.acs_time < :endDate AND NOT ( SELECT B.page FROM time_log AS B WHERE B.id<A.id AND B.user_id= A.user_id ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(acs_time, "%Y-%m-%d %H") ORDER BY time;', 
                { 
                    replacements: { startDate: startDate, endDate: endDate},
                    type: QueryTypes.SELECT
                });
            } else if (timeUnit === "day"){
                let lastDate = new Date(endDate);
                lastDate.setDate(lastDate.getDate()+1);
                const modEndDate = lastDate.toISOString().split('T')[0];
                pv= await sequelize.query('SELECT DATE_FORMAT(acs_time, "%Y-%m-%d") AS time, COUNT(*) AS "all" FROM time_log AS A WHERE A.acs_time > :startDate AND A.acs_time < :endDate AND NOT ( SELECT B.page FROM time_log AS B WHERE B.acs_time<A. AND B.user_id= A.user_id ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(acs_time, "%Y-%m-%d") ORDER BY time;', 
                { 
                    replacements: { startDate: startDate, endDate: modEndDate},
                    type: QueryTypes.SELECT
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
                pv= await sequelize.query('SELECT (:startDate + INTERVAL (DATEDIFF(acs_time, :startDate) DIV 7) WEEK) AS time, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE acs_time > :startDate AND acs_time < :endDate) AS A WHERE NOT ( SELECT B.page FROM (SELECT * FROM time_log WHERE acs_time > :startDate - INTERVAL 10 MINUTE AND acs_time < :endDate) AS B WHERE B.acs_time<A.acs_time AND B.user_id= A.user_id ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATEDIFF(acs_time, :startDate) DIV 7 ORDER BY time;',
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
                pv= await sequelize.query('SELECT DATE_FORMAT(acs_time, "%Y-%m") AS time, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE acs_time > :startDate AND acs_time < :endDate) AS A WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.user_id= A.user_id AND B.acs_time<A.acs_time ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(acs_time, "%Y-%m") ORDER BY time;',
                    //'SELECT DATE_FORMAT(acs_time, "%Y-%m") AS time, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE acs_time > :startDate AND acs_time < :endDate) AS A WHERE NOT ( SELECT B.page FROM (SELECT * FROM time_log WHERE acs_time > :startDate - INTERVAL 10 MINUTE AND acs_time < :endDate) AS B WHERE B.acs_time<A.acs_time AND B.user_id= A.user_id ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(acs_time, "%Y%m") ORDER BY time;',
                    //'SELECT DATE_FORMAT(acs_time, "%Y-%m") AS time, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE acs_time > :startDate AND acs_time < :endDate) AS A WHERE NOT ( SELECT B.page FROM (SELECT * FROM time_log WHERE acs_time < A.acs_time) AS B WHERE B.user_id= A.user_id ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(acs_time, "%Y%m") ORDER BY time;',
                {                           
                    replacements: { startDate: modStartDate, endDate: modEndDate},
                    type: QueryTypes.SELECT
                });
            }else{
                res.json({
                    "result": "fail",
                    "errMessage": "'timeUnit' parameter for pv has value from {hour, day, week, month}"
                });
            }
            console.log(pv);
            //res.json(pv);
            console.log({
                result: "success",
                elements: pv
            });
            res.json({
                result: "success",
                elements: pv
            });

        // group by 페이지
        } else if(group === 2){
        console.log(startDate, endDate);
        
            if (timeUnit === "hour"){
                //let lastDate = new Date(endDate);
                //lastDate.setDate(lastDate.getDate()+1);
                //const modEndDate = lastDate.toISOString().split('T')[0];
                pv= await sequelize.query('SELECT DATE_FORMAT(acs_time, "%Y-%m-%d %H:00:00") AS time, page, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE acs_time > :startDate AND acs_time < :endDate) AS A JOIN usr_user ON A.user_id = usr_user.user_id WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.acs_time<A. AND B.user_id= A.user_id ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(acs_time, "%Y-%m-%d %H"), page ORDER BY time, page;', 
                { 
                    replacements: { startDate: startDate, endDate: endDate},
                    type: QueryTypes.SELECT
                });
            } else if (timeUnit === "day"){
                let lastDate = new Date(endDate);
                lastDate.setDate(lastDate.getDate()+1);
                const modEndDate = lastDate.toISOString().split('T')[0];
                pv= await sequelize.query('SELECT DATE_FORMAT(acs_time, "%Y-%m-%d") AS time, page, COUNT(*) AS "all" FROM time_log AS A WHERE acs_time > :startDate AND acs_time < :endDate AND NOT ( SELECT B.page FROM time_log AS B WHERE B.acs_time<A.acs_time AND B.user_id= A.user_id ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(acs_time, "%Y-%m-%d"), page ORDER BY page;', 
                { 
                    replacements: { startDate: startDate, endDate: modEndDate},
                    type: QueryTypes.SELECT
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
                pv= await sequelize.query('SELECT (:startDate + INTERVAL (DATEDIFF(acs_time, :startDate) DIV 7) WEEK) AS time, page, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE acs_time > :startDate AND acs_time < :endDate) AS A JOIN usr_user ON A.user_id = usr_user.user_id WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.acs_time < A.acs_time AND B.user_id= A.user_id ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATEDIFF(acs_time, :startDate) DIV 7, page ORDER BY time, page;', 
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
                pv= await sequelize.query('SELECT DATE_FORMAT(acs_time, "%Y-%m") AS time, page, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE acs_time > :startDate AND acs_time < :endDate) AS A JOIN usr_user ON A.user_id = usr_user.user_id WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.acs_time<A.acs_time AND B.user_id= A.user_id ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(acs_time, "%Y-%m"), page ORDER BY time, page;',
                {                           
                    replacements: { startDate: modStartDate, endDate: modEndDate},
                    type: QueryTypes.SELECT
                });
            }else{
                res.json({
                    "result": "fail",
                    "errMessage": "'timeUnit' parameter for pv has value from {hour, day, week, month}"
                });
            }
            
            console.log(pv.length);
            pv = groupBy(pv,'time', 'page');
            console.log({
                result: "success",
                elements: pv
            });
            res.json({
                result: "success",
                elements: pv
            });
        // group by 사용자 그룹
        } else if(group === 3){
            console.log(startDate, endDate);
            
            if (timeUnit === "hour"){
                //let lastDate = new Date(endDate);
                //lastDate.setDate(lastDate.getDate()+1);
                //const modEndDate = lastDate.toISOString().split('T')[0];
                pv= await sequelize.query('SELECT DATE_FORMAT(acs_time, "%Y-%m-%d %H:00:00") AS time, user_grp, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE acs_time > :startDate AND acs_time < :endDate) AS A JOIN usr_user ON A.user_id = usr_user.user_id WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.acs_time<A.acs_time AND B.user_id= A.user_id ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(acs_time, "%Y-%m-%d"), DATE_FORMAT(acs_time, "%H"), user_grp ORDER BY time, user_grp;', 
                { 
                    replacements: { startDate: startDate, endDate: endDate},
                    type: QueryTypes.SELECT
                });
            } else if (timeUnit === "day"){
                let lastDate = new Date(endDate);
                lastDate.setDate(lastDate.getDate()+1);
                const modEndDate = lastDate.toISOString().split('T')[0];
                pv= await sequelize.query('SELECT DATE_FORMAT(acs_time, "%Y-%m-%d") AS time, user_grp, COUNT(*) AS "all" FROM time_log AS A JOIN usr_user ON A.user_id = usr_user.user_id WHERE acs_time > :startDate AND acs_time < :endDate AND NOT ( SELECT B.page FROM time_log AS B WHERE B.user_id= A.user_id AND B.id<A.id ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(acs_time, "%Y-%m-%d"), user_grp ORDER BY time, user_grp;', 
                { 
                    replacements: { startDate: startDate, endDate: modEndDate},
                    type: QueryTypes.SELECT
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
                pv= await sequelize.query('SELECT (:startDate + INTERVAL (DATEDIFF(acs_time, :startDate) DIV 7) WEEK) AS time, user_grp, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE acs_time > :startDate AND acs_time < :endDate) AS A JOIN usr_user ON A.user_id = usr_user.user_id WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.acs_time<A.acs_time AND B.user_id= A.user_id ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATEDIFF(acs_time, :startDate) DIV 7, user_grp ORDER BY time, user_grp;', 
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
                pv= await sequelize.query('SELECT DATE_FORMAT(acs_time, "%Y-%m") AS time, user_grp, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE acs_time > :startDate AND acs_time < :endDate) AS A JOIN usr_user ON A.user_id = usr_user.user_id WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.acs_time<A.acs_time AND B.user_id= A.user_id ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(acs_time, "%Y-%m"), user_grp ORDER BY time, user_grp;',
                {                           
                    replacements: { startDate: modStartDate, endDate: modEndDate},
                    type: QueryTypes.SELECT
                });
            }else{
                res.json({
                    "result": "fail",
                    "errMessage": "'timeUnit' parameter for pv has value from {hour, day, week, month}"
                });
            }
            
            console.log(pv.length);
            pv = groupBy(pv,'time', 'user_grp');
            console.log({
                result: "success",
                elements: pv
            });
            res.json({
                result: "success",
                elements: pv
            });
        // group by 제휴사 
        } else if(group === 4){
            console.log(startDate, endDate);
            if (timeUnit === "hour"){
                //let lastDate = new Date(endDate);
                //lastDate.setDate(lastDate.getDate()+1);
                //const modEndDate = lastDate.toISOString().split('T')[0];
                pv= await sequelize.query('SELECT DATE_FORMAT(acs_time, "%Y-%m-%d %H:00:00") AS time, user_org_id, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE acs_time > :startDate AND acs_time < :endDate) AS A JOIN usr_user ON A.user_id = usr_user.user_id WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.acs_time<A.acs_time AND B.user_id= A.user_id AND B.acs_time >(A.acs_time - INTERVAL 10 MINUTE) ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(acs_time, "%Y-%m-%d"), DATE_FORMAT(acs_time, "%H"), user_org_id ORDER BY time, user_org_id;', 
                { 
                    replacements: { startDate: startDate, endDate: endDate},
                    type: QueryTypes.SELECT
                });
            } else if (timeUnit === "day"){
                let lastDate = new Date(endDate);
                lastDate.setDate(lastDate.getDate()+1);
                const modEndDate = lastDate.toISOString().split('T')[0];
                pv= await sequelize.query('SELECT DATE_FORMAT(acs_time, "%Y-%m-%d") AS time, user_org_id, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE acs_time > :startDate AND acs_time < :endDate) AS A JOIN usr_user ON A.user_id = usr_user.user_id WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.acs_time<A.acs_time AND B.user_id= A.user_id AND B.acs_time >(A.acs_time - INTERVAL 10 MINUTE) ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(acs_time, "%Y-%m-%d"), user_org_id ORDER BY time, user_org_id;', 
                { 
                    replacements: { startDate: startDate, endDate: modEndDate},
                    type: QueryTypes.SELECT
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
                pv= await sequelize.query('SELECT (:startDate + INTERVAL (DATEDIFF(acs_time, :startDate) DIV 7) WEEK) AS time, user_org_id, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE acs_time > :startDate AND acs_time < :endDate) AS A JOIN usr_user ON A.user_id = usr_user.user_id WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.acs_time<A.acs_time AND B.user_id= A.user_id AND B.acs_time >(A.acs_time - INTERVAL 10 MINUTE) ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATEDIFF(acs_time, :startDate) DIV 7, user_org_id ORDER BY time, user_org_id', 
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
                pv= await sequelize.query('SELECT DATE_FORMAT(acs_time, "%Y-%m") AS time, user_org_id,COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE acs_time > :startDate AND acs_time < :endDate) AS A JOIN usr_user ON A.user_id = usr_user.user_id WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.acs_time<A.acs_time AND B.user_id= A.user_id AND B.acs_time >(A.acs_time - INTERVAL 10 MINUTE) ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(acs_time, "%Y%m"),user_org_id ORDER BY time,user_org_id;',
                {                           
                    replacements: { startDate: modStartDate, endDate: modEndDate},
                    type: QueryTypes.SELECT
                });
            }else{
                res.json({
                    "result": "fail",
                    "errMessage": "'timeUnit' parameter for pv has value from {hour, day, week, month}"
                });
            }
            
            console.log(pv.length);
            pv = groupBy(pv,'time', 'user_org_id');
            console.log({
                result: "success",
                elements: pv
            });
            res.json({
                result: "success",
                elements: pv
            });
        }
        else{
            res.json({
                "result": "fail",
                "errMessage": "'group' parameter for pv has value 1 to 4"
            });
        }
    } catch (err) {
        console.log(err);
        res.json({
            "result": "fail",
            "errMessage": err
        });
        next(err);
    }
});


// 페이지 조회 라우터
router.post('/page', async (req, res, next)=>{
    try{
        const { time }= req.body;
        let pv;
        console.log(time);
        if (time){
            console.log(time);
            pv= await sequelize.query('SELECT page, page AS subpage, COUNT(*) AS "num" FROM time_log AS A WHERE DATE_FORMAT(A.acs_time, "%Y-%m") = :time AND NOT ( SELECT B.page FROM time_log AS B WHERE B.acs_time<A.acs_time AND B.user_id= A.user_id ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY page ORDER BY page;',
            {                           
                replacements: { time : time },
                type: QueryTypes.SELECT
            });
            for (let ele of pv){
                switch (ele.page){
                    case 'das':
                        ele.page = '대시보드';
                        ele.subpage = '대시보드';
                        break;
                    case 'cal':
                        ele.page = '정산 관리';
                        ele.subpage = '정산조회';
                        break;
                    case 'cus1':
                        ele.page = '고객 관리';
                        ele.subpage = '주문 고객 관리';
                        break;
                    case 'cus2':
                        ele.page = '고객 관리';
                        ele.subpage = '고객 민원 관리';
                        break;
                    case 'cuc1':
                        ele.page = '고객 센터';
                        ele.subpage = '공지 사항';
                        break;
                    case 'cuc2':
                        ele.page = '고객 센터';
                        ele.subpage = '1:1 문의';
                        break;
                    case 'mkt1':
                        ele.page = '마케팅';
                        ele.subpage = '프로모션 신청 조회';
                        break;
                    case 'mkt2':
                        ele.page = '마케팅';
                        ele.subpage = '프로모션';
                        break;
                    case 'cmc1':
                        ele.page = '상품 관리';
                        ele.subpage = '판매 상품 관리';
                        break;
                    case 'cmc2':
                        ele.page = '상품 관리';
                        ele.subpage = '상품 원장 조회';
                        break;
                    case 'sts1':
                        ele.page = '통계 관리';
                        ele.subpage = '일별 통계';
                        break;
                    case 'sts2':
                        ele.page = '통계 관리';
                        ele.subpage = '통합 일별 통계';
                        break;
                    case 'sts3':
                        ele.page = '통계 관리';
                        ele.subpage = '통합 채널 통계';
                        break;
                    case 'sts4':
                        ele.page = '통계 관리';
                        ele.subpage = '채널 통계';
                        break;
                    case 'sal1':
                        ele.page = '판매 관리';
                        ele.subpage = '결제 조회';
                        break;
                    case 'sal2':
                        ele.page = '판매 관리';
                        ele.subpage = '가입/주문 조회';
                        break;
                }
            }
        }else{
            res.json({
                "result": "fail",
                "errMessage": "'time' parameter is essential. You have to fill 'time' parameter"
            });
        }
        console.log({
            result: "success",
            elements: pv
        });
        res.json({
            result: "success",
            elements: pv
        });
    } catch (err) {
        console.log(err);
        res.json({
            "result": "fail",
            "errMessage": err
        });
        next(err);
    }
});

// 실시간
router.post('/realtime', async (req, res, next)=>{
    try{
        const { time }= req.body;
        let uv;
        console.log(time);
        let startTime = moment().subtract(time, 'hours').format('YYYY-MM-DD HH:mm:ss');
        let endTime = moment().format('YYYY-MM-DD HH:mm:ss');
        console.log(startTime, endTime);
        if (time){
            console.log(time);
            uv= await sequelize.query('SELECT DATE_FORMAT(acs_time, "%Y-%m-%d %H:00:00") AS time, COUNT(DISTINCT(user_id)) AS "num" FROM time_log WHERE acs_time > :startTime AND acs_time < :endTime GROUP BY DATE_FORMAT(acs_time, "%Y-%m-%d %H") ORDER BY time;',
            {                           
                replacements: { startTime : startTime, endTime: endTime },
                type: QueryTypes.SELECT
            });
        }else{
            res.json({
                "result": "fail",
                "errMessage": "'time' parameter is essential. You have to fill 'time' parameter"
            });
        }
        console.log({
            result: "success",
            elements: uv
        });
        res.json({
            result: "success",
            elements: uv
        });
    } catch (err) {
        console.log(err);
        res.json({
            "result": "fail",
            "errMessage": "invalid 'time' parameter"
        });
        next(err);
    }
});
module.exports = router;