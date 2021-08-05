const express = require('express');
const { sequelize } = require('../models');
const { QueryTypes, Op, DatabaseError } = require('sequelize');
const { User, TimeLog } = require('../models');
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

const router = express.Router();

let user_grp_domain, user_org_id_domain, page_domain;

const get_domain  = (async ()=>{
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
})();

// groupby function
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
                //let lastDate = new Date(endDate);
                //lastDate.setDate(lastDate.getDate()+1);
                //const modEndDate = lastDate.toISOString().split('T')[0];
                uv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m-%d %H:00:00") AS time, COUNT(DISTINCT(user_id)) AS "all" FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate GROUP BY DATE_FORMAT(asc_time, "%Y-%m-%d"), DATE_FORMAT(asc_time, "%H") ORDER BY time;', 
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
                uv= await sequelize.query('SELECT (:startDate + INTERVAL (DATEDIFF(asc_time, :startDate) DIV 7) WEEK) AS time, COUNT(DISTINCT(user_id)) AS "all" FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate GROUP BY DATEDIFF(asc_time, :startDate) DIV 7;', 
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
            //res.json(uv);
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
                //let lastDate = new Date(endDate);
                //lastDate.setDate(lastDate.getDate()+1);
                //const modEndDate = lastDate.toISOString().split('T')[0];
                uv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m-%d %H:00:00") AS time, user_grp, COUNT(DISTINCT(time_log.user_id)) AS "all" FROM time_log JOIN usr_user ON time_log.user_id = usr_user.user_id WHERE asc_time > :startDate AND asc_time < :endDate GROUP BY DATE_FORMAT(asc_time, "%Y-%m-%d"), DATE_FORMAT(asc_time, "%H"), user_grp ORDER BY time, user_grp;', 
                { 
                    replacements: { startDate: startDate, endDate: endDate},
                    type: QueryTypes.SELECT
                });
            } else if (timeUnit === "day"){
                let lastDate = new Date(endDate);
                lastDate.setDate(lastDate.getDate()+1);
                const modEndDate = lastDate.toISOString().split('T')[0];
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
                uv= await sequelize.query('SELECT (:startDate + INTERVAL (DATEDIFF(asc_time, :startDate) DIV 7) WEEK) AS time, user_grp, COUNT(DISTINCT(time_log.user_id)) AS "all" FROM time_log JOIN usr_user ON time_log.user_id = usr_user.user_id WHERE asc_time > :startDate AND asc_time < :endDate GROUP BY DATEDIFF(asc_time, :startDate) DIV 7, user_grp ORDER BY time, user_grp;', 
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
            console.log(uv);
            uv = groupBy(uv,'time', 'user_grp');
            console.log(uv);
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
                uv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m-%d %H:00:00") AS time, user_org_id, COUNT(DISTINCT(time_log.user_id)) AS "all" FROM time_log JOIN usr_user ON time_log.user_id = usr_user.user_id WHERE asc_time > :startDate AND asc_time < :endDate GROUP BY DATE_FORMAT(asc_time, "%Y-%m-%d"), DATE_FORMAT(asc_time, "%H"), user_org_id ORDER BY time, user_org_id;', 
                { 
                    replacements: { startDate: startDate, endDate: endDate},
                    type: QueryTypes.SELECT
                });
            } else if (timeUnit === "day"){
                let lastDate = new Date(endDate);
                lastDate.setDate(lastDate.getDate()+1);
                const modEndDate = lastDate.toISOString().split('T')[0];
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
                uv= await sequelize.query('SELECT (:startDate + INTERVAL (DATEDIFF(asc_time, :startDate) DIV 7) WEEK) AS time, user_org_id, COUNT(DISTINCT(time_log.user_id)) AS "all" FROM time_log JOIN usr_user ON time_log.user_id = usr_user.user_id WHERE asc_time > :startDate AND asc_time < :endDate GROUP BY DATEDIFF(asc_time, :startDate) DIV 7, user_org_id ORDER BY time, user_org_id;', 
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
            uv = groupBy(uv,'time', 'user_org_id');
            console.log(uv);
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
                pv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m-%d %H:00:00") AS time, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate) AS A WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.id<A.id AND B.user_id= A.user_id ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(asc_time, "%Y-%m-%d"), DATE_FORMAT(asc_time, "%H") ORDER BY time;', 
                { 
                    replacements: { startDate: startDate, endDate: endDate},
                    type: QueryTypes.SELECT
                });
            } else if (timeUnit === "day"){
                let lastDate = new Date(endDate);
                lastDate.setDate(lastDate.getDate()+1);
                const modEndDate = lastDate.toISOString().split('T')[0];
                pv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m-%d") AS time, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate) AS A WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.id<A.id AND B.user_id= A.user_id ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(asc_time, "%Y-%m-%d") ORDER BY time;', 
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
                pv= await sequelize.query('SELECT (:startDate + INTERVAL (DATEDIFF(asc_time, :startDate) DIV 7) WEEK) AS time, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate) AS A WHERE NOT ( SELECT B.page FROM (SELECT * FROM time_log WHERE asc_time > :startDate - INTERVAL 10 MINUTE AND asc_time < :endDate) AS B WHERE B.asc_time<A.asc_time AND B.user_id= A.user_id ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATEDIFF(asc_time, :startDate) DIV 7 ORDER BY time;',
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
                pv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m") AS time, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate) AS A WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.user_id= A.user_id AND B.asc_time<A.asc_time ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(asc_time, "%Y-%m") ORDER BY time;',
                    //'SELECT DATE_FORMAT(asc_time, "%Y-%m") AS time, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate) AS A WHERE NOT ( SELECT B.page FROM (SELECT * FROM time_log WHERE asc_time > :startDate - INTERVAL 10 MINUTE AND asc_time < :endDate) AS B WHERE B.asc_time<A.asc_time AND B.user_id= A.user_id ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(asc_time, "%Y%m") ORDER BY time;',
                    //'SELECT DATE_FORMAT(asc_time, "%Y-%m") AS time, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate) AS A WHERE NOT ( SELECT B.page FROM (SELECT * FROM time_log WHERE asc_time < A.asc_time) AS B WHERE B.user_id= A.user_id ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(asc_time, "%Y%m") ORDER BY time;',
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
                pv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m-%d %H:00:00") AS time, page, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate) AS A JOIN usr_user ON A.user_id = usr_user.user_id WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.asc_time<A. AND B.user_id= A.user_id ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(asc_time, "%Y-%m-%d"), DATE_FORMAT(asc_time, "%H"), page ORDER BY time, page;', 
                { 
                    replacements: { startDate: startDate, endDate: endDate},
                    type: QueryTypes.SELECT
                });
            } else if (timeUnit === "day"){
                let lastDate = new Date(endDate);
                lastDate.setDate(lastDate.getDate()+1);
                const modEndDate = lastDate.toISOString().split('T')[0];
                pv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m-%d") AS time, page, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate) AS A JOIN usr_user ON A.user_id = usr_user.user_id WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.asc_time<A.asc_time AND B.user_id= A.user_id ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(asc_time, "%Y-%m-%d"), page ORDER BY time, page;', 
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
                pv= await sequelize.query('SELECT (:startDate + INTERVAL (DATEDIFF(asc_time, :startDate) DIV 7) WEEK) AS time, page, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate) AS A JOIN usr_user ON A.user_id = usr_user.user_id WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.asc_time < A.asc_time AND B.user_id= A.user_id ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATEDIFF(asc_time, :startDate) DIV 7, page ORDER BY time, page;', 
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
                pv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m") AS time, page, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate) AS A JOIN usr_user ON A.user_id = usr_user.user_id WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.asc_time<A.asc_time AND B.user_id= A.user_id ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(asc_time, "%Y-%m"), page ORDER BY time, page;',
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
                pv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m-%d %H:00:00") AS time, user_grp, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate) AS A JOIN usr_user ON A.user_id = usr_user.user_id WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.asc_time<A.asc_time AND B.user_id= A.user_id ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(asc_time, "%Y-%m-%d"), DATE_FORMAT(asc_time, "%H"), user_grp ORDER BY time, user_grp;', 
                { 
                    replacements: { startDate: startDate, endDate: endDate},
                    type: QueryTypes.SELECT
                });
            } else if (timeUnit === "day"){
                let lastDate = new Date(endDate);
                lastDate.setDate(lastDate.getDate()+1);
                const modEndDate = lastDate.toISOString().split('T')[0];
                pv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m-%d") AS time, user_grp, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate) AS A JOIN usr_user ON A.user_id = usr_user.user_id WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.asc_time<A.asc_time AND B.user_id= A.user_id ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(asc_time, "%Y-%m-%d"), user_grp ORDER BY time, user_grp;', 
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
                pv= await sequelize.query('SELECT (:startDate + INTERVAL (DATEDIFF(asc_time, :startDate) DIV 7) WEEK) AS time, user_grp, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate) AS A JOIN usr_user ON A.user_id = usr_user.user_id WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.asc_time<A.asc_time AND B.user_id= A.user_id ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATEDIFF(asc_time, :startDate) DIV 7, user_grp ORDER BY time, user_grp;', 
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
                pv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m") AS time, user_grp, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate) AS A JOIN usr_user ON A.user_id = usr_user.user_id WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.asc_time<A.asc_time AND B.user_id= A.user_id ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(asc_time, "%Y-%m"), user_grp ORDER BY time, user_grp;',
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
                pv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m-%d %H:00:00") AS time, user_org_id, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate) AS A JOIN usr_user ON A.user_id = usr_user.user_id WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.asc_time<A.asc_time AND B.user_id= A.user_id AND B.asc_time >(A.asc_time - INTERVAL 10 MINUTE) ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(asc_time, "%Y-%m-%d"), DATE_FORMAT(asc_time, "%H"), user_org_id ORDER BY time, user_org_id;', 
                { 
                    replacements: { startDate: startDate, endDate: endDate},
                    type: QueryTypes.SELECT
                });
            } else if (timeUnit === "day"){
                let lastDate = new Date(endDate);
                lastDate.setDate(lastDate.getDate()+1);
                const modEndDate = lastDate.toISOString().split('T')[0];
                pv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m-%d") AS time, user_org_id, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate) AS A JOIN usr_user ON A.user_id = usr_user.user_id WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.asc_time<A.asc_time AND B.user_id= A.user_id AND B.asc_time >(A.asc_time - INTERVAL 10 MINUTE) ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(asc_time, "%Y-%m-%d"), user_org_id ORDER BY time, user_org_id;', 
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
                pv= await sequelize.query('SELECT (:startDate + INTERVAL (DATEDIFF(asc_time, :startDate) DIV 7) WEEK) AS time, user_org_id, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate) AS A JOIN usr_user ON A.user_id = usr_user.user_id WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.asc_time<A.asc_time AND B.user_id= A.user_id AND B.asc_time >(A.asc_time - INTERVAL 10 MINUTE) ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATEDIFF(asc_time, :startDate) DIV 7, user_org_id ORDER BY time, user_org_id', 
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
                pv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m") AS time, user_org_id,COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate) AS A JOIN usr_user ON A.user_id = usr_user.user_id WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.asc_time<A.asc_time AND B.user_id= A.user_id AND B.asc_time >(A.asc_time - INTERVAL 10 MINUTE) ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(asc_time, "%Y%m"),user_org_id ORDER BY time,user_org_id;',
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
            pv= await sequelize.query('SELECT page, page AS subpage, COUNT(*) AS "num" FROM (SELECT * FROM time_log WHERE DATE_FORMAT(asc_time, "%Y-%m") = :time ) AS A WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.asc_time<A.asc_time AND B.user_id= A.user_id ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(asc_time, "%Y-%m"), page ORDER BY page;',
            {                           
                replacements: { time : time },
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
            uv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m-%d %H:00:00") AS time, COUNT(DISTINCT(user_id)) AS "num" FROM time_log WHERE asc_time > :startTime AND asc_time < :endTime GROUP BY DATE_FORMAT(asc_time, "%Y-%m-%d %H") ORDER BY time;',
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