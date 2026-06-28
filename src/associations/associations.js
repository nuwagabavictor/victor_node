const sequelize = require("../../config/sequelize");
const User = require('../models/user');
const Contact = require('../models/Contact');
const RefreshToken = require("../models/refreshToken");
const TwoFactor = require('../models/twoFactor');


User.hasMany(Contact, {
    foreignKey: 'created_by',
    as: 'contacts',
    onDelete: 'CASCADE'
});

Contact.belongsTo(User, {foreignKey: 'created_by', as: 'user'});

User.hasMany(RefreshToken,{
    foreignKey: 'user_id',
    as: 'refreshTokens',
    onDelete: 'CASCADE'
})

RefreshToken.belongsTo(User,{foreignKey: 'user_id', as: 'user'})



User.hasMany(TwoFactor,{
    foreignKey: 'user_id',
    as: 'twoFactors',
    onDelete: 'CASCADE'
})

TwoFactor.belongsTo(User,{foreignKey: 'user_id', as: 'user'})