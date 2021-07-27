const Sequelize = require('sequelize');

module.exports = class UserLog extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            time : {
                type: Sequelize.DATE,
                allowNull: false,
            },
            adm : { //관리자
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            opr : { //제휴현업
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            aff : { //제휴사
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            etc : { //기타
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            aff_list : {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            inactive_user : {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'UserLog',
            tableName: 'user_log',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {}
};