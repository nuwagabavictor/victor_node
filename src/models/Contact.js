const {DataTypes} = require('sequelize');
const sequelize = require("../../config/sequelize")

const Contact = sequelize.define('Contact', {
    id:{
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    type:{
        type: DataTypes.ENUM('PRIMARY', 'SECONDARY'),
        allowNull: false,
    },
    status:{
        type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
        allowNull: false,
        defaultValue: 'ACTIVE'
    },
    created_by:{
        type: DataTypes.BIGINT,
        allowNull: false,
    }
}, {
    timestamps:true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'm_contact'
})

module.exports = Contact;