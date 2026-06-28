const {DataTypes} = require('sequelize');
const sequelize = require("../../config/sequelize")

const RefreshToken = sequelize.define('RefreshToken', {
    id:{
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    is_used:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    user_id:{
        type: DataTypes.BIGINT,
        allowNull: false,
    }
}, {
    timestamps:true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'm_refresh_token'
})

module.exports = RefreshToken;