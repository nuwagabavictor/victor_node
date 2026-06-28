const {DataTypes} = require('sequelize');
const sequelize = require("../../config/sequelize")


const TwoFactor = sequelize.define('TwoFactor', {
    id:{
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    secret: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_id:{
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    is_used:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    timestamps:true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'm_two_factor'
})

module.exports = TwoFactor;