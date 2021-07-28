const express = require('express');
const { sequelize } = require('../models');
const { QueryTypes, Op, DatabaseError } = require('sequelize');
const { User, TimeLog } = require('../models');

const router = express.Router();

const user_grp_domain = (async ()=>{
    const result = await sequelize.query('SELECT DISTINCT(user_grp) FROM usr_user', 
                { 
                    type: QueryTypes.SELECT
                });
    let res = [];
    for (let el of result){
        res.push(el.user_grp);
    }
    console.log(res);
    return result;
})()
const user_org_id_domain = (async ()=>{
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
})()

// groupby function
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

// UV 라우터
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
                uv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m-%d %H:00:00") AS time, COUNT(DISTINCT(user_id)) AS "all" FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate GROUP BY DATE_FORMAT(asc_time, "%Y-%m-%d"), DATE_FORMAT(asc_time, "%H") ORDER BY time;', 
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
            res.json(uv);
            /*
            console.log({
                result: "success",
                elements: uv
            });
            res.json({
                result: "success",
                elements: uv
            });*/
            
        // group by 사용자 그룹
        } else if(group === 2){
            console.log(startDate, endDate);
            
            if (timeUnit === "hour"){
                newDate = (Number(endDate.slice(8, 10))+1).toString().padStart(2, '0');
                console.log(newDate);
                let modEndDate = endDate.slice(0, 8)+ newDate;
                uv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m-%d %H:00:00") AS time, user_grp, COUNT(DISTINCT(time_log.user_id)) AS "all" FROM time_log JOIN usr_user ON time_log.user_id = usr_user.user_id WHERE asc_time > :startDate AND asc_time < :endDate GROUP BY DATE_FORMAT(asc_time, "%Y-%m-%d"), DATE_FORMAT(asc_time, "%H"), user_grp ORDER BY time, user_grp;', 
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
            uv = groupBy(uv,'time', 'user_grp');
            console.log(uv);
            res.json(uv);
            /*
            console.log({
                result: "success",
                elements: uv
            });
            res.json({
                result: "success",
                elements: uv
            });*/

        // group by 제휴사 
        } else if(group === 3){
            console.log(startDate, endDate);
            
            if (timeUnit === "hour"){
                newDate = (Number(endDate.slice(8, 10))+1).toString().padStart(2, '0');
                console.log(newDate);
                let modEndDate = endDate.slice(0, 8)+ newDate;
                uv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m-%d %H:00:00") AS time, user_org_id, COUNT(DISTINCT(time_log.user_id)) AS "all" FROM time_log JOIN usr_user ON time_log.user_id = usr_user.user_id WHERE asc_time > :startDate AND asc_time < :endDate GROUP BY DATE_FORMAT(asc_time, "%Y-%m-%d"), DATE_FORMAT(asc_time, "%H"), user_org_id ORDER BY time, user_org_id;', 
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
            
            console.log(uv.length);
            uv = groupBy(uv,'time', 'user_org_id');
            console.log(uv);
            res.json(uv);
            /*
            console.log({
                result: "success",
                elements: uv
            });
            res.json({
                result: "success",
                elements: uv
            });*/
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
        const { startDate, endDate, timeUnit, group }= req.body;
        let pv;
        // no grouping
        if (group === 1){
            console.log(startDate, endDate);
            if (timeUnit === "hour"){
                newDate = (Number(endDate.slice(8, 10))+1).toString().padStart(2, '0');
                console.log(newDate);
                let modEndDate = endDate.slice(0, 8)+ newDate;
                pv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m-%d %H:00:00") AS time, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate) AS A WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.id<A.id AND B.user_id= A.user_id AND B.asc_time >(A.asc_time - INTERVAL 10 MINUTE) ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(asc_time, "%Y-%m-%d"), DATE_FORMAT(asc_time, "%H") ORDER BY time;', 
                { 
                    replacements: { startDate: startDate, endDate: modEndDate},
                    type: QueryTypes.SELECT
                });
            } else if (timeUnit === "day"){
                newDate = (Number(endDate.slice(8, 10))+1).toString().padStart(2, '0');
                console.log(newDate);
                let modEndDate = endDate.slice(0, 8)+ newDate;
                pv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m-%d") AS time, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate) AS A WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.id<A.id AND B.user_id= A.user_id AND B.asc_time >(A.asc_time - INTERVAL 10 MINUTE) ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(asc_time, "%Y-%m-%d") ORDER BY time;', 
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
                pv= await sequelize.query('SELECT (:startDate + INTERVAL (DATEDIFF(asc_time, :startDate) DIV 7) WEEK) AS time, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate) AS A WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.id<A.id AND B.user_id= A.user_id AND B.asc_time >(A.asc_time - INTERVAL 10 MINUTE) ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATEDIFF(asc_time, :startDate) DIV 7 ORDER BY time;', 
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
                pv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m") AS time, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate) AS A WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.id<A.id AND B.user_id= A.user_id AND B.asc_time >(A.asc_time - INTERVAL 10 MINUTE) ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(asc_time, "%Y%m") ORDER BY time;',
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
            res.json(pv);
        // group by 페이지
        } else if(group === 2){
        console.log(startDate, endDate);
        
        if (timeUnit === "hour"){
            newDate = (Number(endDate.slice(8, 10))+1).toString().padStart(2, '0');
            console.log(newDate);
            let modEndDate = endDate.slice(0, 8)+ newDate;
            pv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m-%d %H:00:00") AS time, page, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate) AS A JOIN usr_user ON A.user_id = usr_user.user_id WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.id<A.id AND B.user_id= A.user_id AND B.asc_time >(A.asc_time - INTERVAL 10 MINUTE) ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(asc_time, "%Y-%m-%d"), DATE_FORMAT(asc_time, "%H"), page ORDER BY time, page;', 
            { 
                replacements: { startDate: startDate, endDate: modEndDate},
                type: QueryTypes.SELECT
            });
        } else if (timeUnit === "day"){
            newDate = (Number(endDate.slice(8, 10))+1).toString().padStart(2, '0');
            console.log(newDate);
            let modEndDate = endDate.slice(0, 8)+ newDate;
            pv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m-%d") AS time, page, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate) AS A JOIN usr_user ON A.user_id = usr_user.user_id WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.id<A.id AND B.user_id= A.user_id AND B.asc_time >(A.asc_time - INTERVAL 10 MINUTE) ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(asc_time, "%Y-%m-%d"), page ORDER BY time, page;', 
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
            pv= await sequelize.query('SELECT (:startDate + INTERVAL (DATEDIFF(asc_time, :startDate) DIV 7) WEEK) AS time, page, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate) AS A JOIN usr_user ON A.user_id = usr_user.user_id WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.id<A.id AND B.user_id= A.user_id AND B.asc_time >(A.asc_time - INTERVAL 10 MINUTE) ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATEDIFF(asc_time, :startDate) DIV 7, page ORDER BY time, page;', 
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
            pv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m") AS time, page, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate) AS A JOIN usr_user ON A.user_id = usr_user.user_id WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.id<A.id AND B.user_id= A.user_id AND B.asc_time >(A.asc_time - INTERVAL 10 MINUTE) ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(asc_time, "%Y-%m"), page ORDER BY time, page;',
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
        console.log(pv);
        res.json(pv);
        // group by 사용자 그룹
        } else if(group === 3){
            console.log(startDate, endDate);
            
            if (timeUnit === "hour"){
                newDate = (Number(endDate.slice(8, 10))+1).toString().padStart(2, '0');
                console.log(newDate);
                let modEndDate = endDate.slice(0, 8)+ newDate;
                pv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m-%d %H:00:00") AS time, user_grp, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate) AS A JOIN usr_user ON A.user_id = usr_user.user_id WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.id<A.id AND B.user_id= A.user_id AND B.asc_time >(A.asc_time - INTERVAL 10 MINUTE) ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(asc_time, "%Y-%m-%d"), DATE_FORMAT(asc_time, "%H"), user_grp ORDER BY time, user_grp;', 
                { 
                    replacements: { startDate: startDate, endDate: modEndDate},
                    type: QueryTypes.SELECT
                });
            } else if (timeUnit === "day"){
                newDate = (Number(endDate.slice(8, 10))+1).toString().padStart(2, '0');
                console.log(newDate);
                let modEndDate = endDate.slice(0, 8)+ newDate;
                pv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m-%d") AS time, user_grp, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate) AS A JOIN usr_user ON A.user_id = usr_user.user_id WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.id<A.id AND B.user_id= A.user_id AND B.asc_time >(A.asc_time - INTERVAL 10 MINUTE) ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(asc_time, "%Y-%m-%d"), user_grp ORDER BY time, user_grp;', 
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
                pv= await sequelize.query('SELECT (:startDate + INTERVAL (DATEDIFF(asc_time, :startDate) DIV 7) WEEK) AS time, user_grp, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate) AS A JOIN usr_user ON A.user_id = usr_user.user_id WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.id<A.id AND B.user_id= A.user_id AND B.asc_time >(A.asc_time - INTERVAL 10 MINUTE) ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATEDIFF(asc_time, :startDate) DIV 7, user_grp ORDER BY time, user_grp;', 
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
                pv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m") AS time, user_grp, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate) AS A JOIN usr_user ON A.user_id = usr_user.user_id WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.id<A.id AND B.user_id= A.user_id AND B.asc_time >(A.asc_time - INTERVAL 10 MINUTE) ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(asc_time, "%Y-%m"), user_grp ORDER BY time, user_grp;',
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
            console.log(pv);
            res.json(pv);
        // group by 제휴사 
        } else if(group === 4){
            console.log(startDate, endDate);
            
            if (timeUnit === "hour"){
                newDate = (Number(endDate.slice(8, 10))+1).toString().padStart(2, '0');
                console.log(newDate);
                let modEndDate = endDate.slice(0, 8)+ newDate;
                pv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m-%d %H:00:00") AS time, user_org_id, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate) AS A JOIN usr_user ON A.user_id = usr_user.user_id WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.id<A.id AND B.user_id= A.user_id AND B.asc_time >(A.asc_time - INTERVAL 10 MINUTE) ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(asc_time, "%Y-%m-%d"), DATE_FORMAT(asc_time, "%H"), user_org_id ORDER BY time, user_org_id;', 
                { 
                    replacements: { startDate: startDate, endDate: modEndDate},
                    type: QueryTypes.SELECT
                });
            } else if (timeUnit === "day"){
                newDate = (Number(endDate.slice(8, 10))+1).toString().padStart(2, '0');
                console.log(newDate);
                let modEndDate = endDate.slice(0, 8)+ newDate;
                pv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m-%d") AS time, user_org_id, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate) AS A JOIN usr_user ON A.user_id = usr_user.user_id WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.id<A.id AND B.user_id= A.user_id AND B.asc_time >(A.asc_time - INTERVAL 10 MINUTE) ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(asc_time, "%Y-%m-%d"), user_org_id ORDER BY time, user_org_id;', 
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
                pv= await sequelize.query('SELECT (:startDate + INTERVAL (DATEDIFF(asc_time, :startDate) DIV 7) WEEK) AS time, user_org_id, COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate) AS A JOIN usr_user ON A.user_id = usr_user.user_id WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.id<A.id AND B.user_id= A.user_id AND B.asc_time >(A.asc_time - INTERVAL 10 MINUTE) ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATEDIFF(asc_time, :startDate) DIV 7, user_org_id ORDER BY time, user_org_id', 
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
                pv= await sequelize.query('SELECT DATE_FORMAT(asc_time, "%Y-%m") AS time, user_org_id,COUNT(*) AS "all" FROM (SELECT * FROM time_log WHERE asc_time > :startDate AND asc_time < :endDate) AS A JOIN usr_user ON A.user_id = usr_user.user_id WHERE NOT ( SELECT B.page FROM time_log AS B WHERE B.id<A.id AND B.user_id= A.user_id AND B.asc_time >(A.asc_time - INTERVAL 10 MINUTE) ORDER BY B.id DESC LIMIT 1 ) <=> A.page GROUP BY DATE_FORMAT(asc_time, "%Y%m"),user_org_id ORDER BY time,user_org_id;',
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
            console.log(pv);
            res.json(pv);
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

module.exports = router;