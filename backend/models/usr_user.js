const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            user_id : {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            user_name : {
                type: Sequelize.STRING(30),
                allowNull: false,
            },
            user_grp : {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            user_org_id : {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            recent_acs : {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'User',
            tableName: 'usr_user',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {
        db.User.hasMany(db.TimeLog, { foreignKey: 'user_id', sourceKey: 'user_id' });
    }
};