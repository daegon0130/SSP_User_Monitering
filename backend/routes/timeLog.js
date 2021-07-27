const express = require('express');
const { sequelize } = require('../models');
const { QueryTypes, Op, DatabaseError } = require('sequelize');
const { User, TimeLog } = require('../models');

const router = express.Router();

const groupBy = function (data, key, grp) {
    const sol = data.reduce(function (carry, el) {
        let group = el[key];

        if (carry[group] === undefined) {
            carry[group] = {};
            carry[group].time = el[key];
        }
        //carry[group].push(el)
        carry[group][el[grp]] = el.all;
        return carry;
    }, {});
    return Object.values(sol);
}

router.post('/uv', async (req, res, next)=>{
    try{
        const { startDate, endDate, timeUnit, group }= req.body;
        let uv;
        // no grouping
        if (group === 1){
            console.log(startDate, endDate);
            if (timeUnit === "hour"){
                newDate = (Number(endDate.slice(8, 10))+1).toString().padStart(2, '0');
                console.log(newDate);
                let modEndDate = endDate.slice(0, 8)+ newDate;
                uv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m-%d %Hh") AS time, COUNT(DISTINCT(user_id)) AS "all" FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate GROUP BY DATE_FORMAT(asc_time, "%Y-%m-%d"), DATE_FORMAT(asc_time, "%H") ORDER BY time;', 
                { 
                    replacements: { startDate: startDate, endDate: modEndDate},
                    type: QueryTypes.SELECT
                });
            } else if (timeUnit === "day"){
                newDate = (Number(endDate.slice(8, 10))+1).toString().padStart(2, '0');
                console.log(newDate);
                let modEndDate = endDate.slice(0, 8)+ newDate;
                uv = await TimeLog.findAll({
                    attributes : [
                        [sequelize.fn('date_format', sequelize.col('asc_time'), '%Y-%m-%d'), 'time'],
                        [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('user_id'))), 'all'],
                    ],
                    where: {
                        asc_time :  {
                            [Op.lt]: modEndDate,
                            [Op.gt]: startDate
                        },
                    },
                    group: [sequelize.fn('date_format', sequelize.col('asc_time'), '%Y-%m-%d')],
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
                uv= await sequelize.query('SELECT CONCAT( :startDate + INTERVAL (DATEDIFF(asc_time, :startDate) DIV 7) WEEK, "~", :startDate + INTERVAL (DATEDIFF(asc_time, :startDate) DIV 7) WEEK + INTERVAL 1 WEEK - INTERVAL 1 DAY ) AS time, COUNT(DISTINCT(user_id)) AS "all" FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate GROUP BY DATEDIFF(asc_time, :startDate) DIV 7;', 
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
                uv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m") AS time, COUNT(DISTINCT(user_id)) AS "all" FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate GROUP BY DATE_FORMAT(asc_time, "%Y%m");',
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
            console.log(uv);
            res.json(uv);
        // group by 사용자 그룹
        } else if(group === 2){
            console.log(startDate, endDate);
            
            if (timeUnit === "hour"){
                newDate = (Number(endDate.slice(8, 10))+1).toString().padStart(2, '0');
                console.log(newDate);
                let modEndDate = endDate.slice(0, 8)+ newDate;
                uv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m-%d %Hh") AS time, user_grp, COUNT(DISTINCT(time_log.user_id)) AS "all" FROM time_log JOIN usr_user ON time_log.user_id = usr_user.user_id WHERE asc_time > :startDate AND asc_time < :endDate GROUP BY DATE_FORMAT(asc_time, "%Y-%m-%d"), DATE_FORMAT(asc_time, "%H"), user_grp ORDER BY time, user_grp;', 
                { 
                    replacements: { startDate: startDate, endDate: modEndDate},
                    type: QueryTypes.SELECT
                });
            } else if (timeUnit === "day"){
                newDate = (Number(endDate.slice(8, 10))+1).toString().padStart(2, '0');
                console.log(newDate);
                let modEndDate = endDate.slice(0, 8)+ newDate;
                uv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m-%d") AS time, user_grp, COUNT(DISTINCT(time_log.user_id)) AS "all" FROM time_log JOIN usr_user ON time_log.user_id = usr_user.user_id WHERE asc_time > :startDate AND asc_time < :endDate GROUP BY DATE_FORMAT(asc_time, "%Y-%m-%d"), user_grp ORDER BY time, user_grp;', 
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
                uv= await sequelize.query('SELECT CONCAT( :startDate + INTERVAL (DATEDIFF(asc_time, :startDate) DIV 7) WEEK, "~", :startDate + INTERVAL (DATEDIFF(asc_time, :startDate) DIV 7) WEEK + INTERVAL 1 WEEK - INTERVAL 1 DAY ) AS time, user_grp, COUNT(DISTINCT(time_log.user_id)) AS "all" FROM time_log JOIN usr_user ON time_log.user_id = usr_user.user_id WHERE asc_time > :startDate AND asc_time < :endDate GROUP BY DATEDIFF(asc_time, :startDate) DIV 7, user_grp ORDER BY time, user_grp;', 
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
                uv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m") AS time, user_grp, COUNT(DISTINCT(time_log.user_id)) as "all" FROM time_log JOIN usr_user ON time_log.user_id = usr_user.user_id WHERE asc_time > :startDate AND asc_time < :endDate GROUP BY DATE_FORMAT(asc_time, "%Y%m"), user_grp ORDER BY time, user_grp;',
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
            
            console.log(uv.length);
            uv = groupBy(uv,'time', 'user_grp');
            console.log(uv);
            res.json(uv);
        // group by 제휴사 
        } else if(group === 3){
            console.log(startDate, endDate);
            
            if (timeUnit === "hour"){
                newDate = (Number(endDate.slice(8, 10))+1).toString().padStart(2, '0');
                console.log(newDate);
                let modEndDate = endDate.slice(0, 8)+ newDate;
                uv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m-%d %Hh") AS time, user_org_id, COUNT(DISTINCT(time_log.user_id)) AS "all" FROM time_log JOIN usr_user ON time_log.user_id = usr_user.user_id WHERE asc_time > :startDate AND asc_time < :endDate GROUP BY DATE_FORMAT(asc_time, "%Y-%m-%d"), DATE_FORMAT(asc_time, "%H"), user_org_id ORDER BY time, user_org_id;', 
                { 
                    replacements: { startDate: startDate, endDate: modEndDate},
                    type: QueryTypes.SELECT
                });
            } else if (timeUnit === "day"){
                newDate = (Number(endDate.slice(8, 10))+1).toString().padStart(2, '0');
                console.log(newDate);
                let modEndDate = endDate.slice(0, 8)+ newDate;
                uv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m-%d") AS time, user_org_id, COUNT(DISTINCT(time_log.user_id)) AS "all" FROM time_log JOIN usr_user ON time_log.user_id = usr_user.user_id WHERE asc_time > :startDate AND asc_time < :endDate GROUP BY DATE_FORMAT(asc_time, "%Y-%m-%d"), user_org_id ORDER BY time, user_org_id;', 
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
                uv= await sequelize.query('SELECT CONCAT( :startDate + INTERVAL (DATEDIFF(asc_time, :startDate) DIV 7) WEEK, "~", :startDate + INTERVAL (DATEDIFF(asc_time, :startDate) DIV 7) WEEK + INTERVAL 1 WEEK - INTERVAL 1 DAY ) AS time, user_org_id, COUNT(DISTINCT(time_log.user_id)) AS "all" FROM time_log JOIN usr_user ON time_log.user_id = usr_user.user_id WHERE asc_time > :startDate AND asc_time < :endDate GROUP BY DATEDIFF(asc_time, :startDate) DIV 7, user_org_id ORDER BY time, user_org_id;', 
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
                uv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m") AS time, user_org_id, COUNT(DISTINCT(time_log.user_id)) as "all" FROM time_log JOIN usr_user ON time_log.user_id = usr_user.user_id WHERE asc_time > :startDate AND asc_time < :endDate GROUP BY DATE_FORMAT(asc_time, "%Y%m"), user_org_id ORDER BY time, user_org_id;',
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
            
            console.log(uv.length);
            uv = groupBy(uv,'time', 'user_org_id');
            console.log(uv);
            res.json(uv);
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

router.post('/pv', (req, res, next)=>{
    try{
        res.send(req.body);
    } catch (err) {
        console.log(err);
        next(err);
    }
});

module.exports = router;