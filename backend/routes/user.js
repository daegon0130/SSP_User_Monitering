const express = require('express');
const { sequelize } = require('../models');
const { QueryTypes, Op } = require('sequelize');
const User = require('../models/usr_user');

const router = express.Router();

router.get('/', async (req, res, next)=>{
    try{
        //let groups= await sequelize.query('SELECT user_grp AS grp, COUNT(user_id) AS cnt FROM usr_user GROUP BY user_grp;', { type: QueryTypes.SELECT });
        let groups = await User.findAll({
            attributes : [
                ['user_grp', 'grp'],
                [sequelize.fn('COUNT', sequelize.col('user_id')), 'cnt'],
            ],
            group : 'user_grp',
            raw: true
        });
        console.log(groups);
        let group = {}
        for(let i=0; i<groups.length; i++){
            group[groups[i].grp] = groups[i].cnt;
        }
        // 현재 날짜로부터 90일전 날짜 구하기
        let today = new Date();
        today.setDate(today.getDate() - 90);
        const year = today.getFullYear();
        const month = ('0' + (today.getMonth() + 1)).slice(-2);
        const day = ('0' + today.getDate()).slice(-2);
        const dateString = year + '-' + month  + '-' + day;
        let [{ inactive_user }] = await sequelize.query(
            'SELECT COUNT(user_id) AS inactive_user FROM usr_user WHERE `user_id` NOT IN (SELECT DISTINCT user_id FROM time_log WHERE asc_time > :date);',
            {
                replacements: { date: dateString },
                type: QueryTypes.SELECT,
            }
        );
        res.json({
            "result": "success",
            "group" : group,
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

router.post('/trends', (req, res, next)=>{
    try{
        const { startDate, endDate, timeUnit, group }= req.body;
        res.json({
            "result": "success",
            "elements" : 3
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

module.exports = router;