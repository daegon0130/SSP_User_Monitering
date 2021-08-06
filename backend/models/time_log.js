const Sequelize = require('sequelize');

module.exports = class TimeLog extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            acs_time : {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            page : {
                type: Sequelize.STRING(10),
                allowNull: false,
            },
            event_type : {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'TimeLog',
            tableName: 'time_log',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {
        db.TimeLog.belongsTo( db.User, { foreignKey: 'user_id', targetKey: 'user_id' });
    }
};