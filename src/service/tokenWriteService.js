const {generateToken} = require("../../utils/jwtUtil");
const crypto = require('crypto');
const tokenConstants = require('../constants/tokenConstants');
const User = require('../models/user');
const RefreshToken = require('../models/refreshToken');
const sequelize = require("../../config/sequelize");

class TokenWriteService {

    async generateToken(user){

        return await sequelize.transaction(async transaction => {

            const token = crypto.randomUUID().replace(/-/g, '');
            const createdAt = new Date(
                Date.now()
            );
            const expiresAt = new Date(
                Date.now() + tokenConstants.REFRESH_TOKEN_EXPIRY
            );
            const isUsed = false;

            await RefreshToken.create({
                token: token,
                expires_at: expiresAt,
                created_at: createdAt,
                is_used: isUsed,
                user_id: user.id
            }, {transaction});

            return token;
        });
    }

    async createAccessToken(token){

        return sequelize.transaction(async transaction => {
            const existingToken = await RefreshToken.findOne({where: {
                token: token
                },
                include: [{
                    model: User,
                    as: 'user'
                }], transaction
            })

            if (!existingToken) {
                throw new Error("Refresh token not found");
            }

            if (existingToken.is_used) {
                throw new Error("Refresh token already used");
            }

            if (existingToken.expires_at < new Date()) {
                throw new Error("Refresh token expired");
            }

            const tokenUser = existingToken.user;

            if (!tokenUser) {
                throw new Error("User not found");
            }
            existingToken.is_used = true;
            await existingToken.save({transaction});


            const newToken = await this.generateToken(tokenUser);

            const jwtToken = generateToken(tokenUser);

            return{
                id: tokenUser.id,
                email: tokenUser.email,
                role: tokenUser.role,
                accessToken: jwtToken,
                refreshToken: newToken
            }
        });

    }
}

module.exports = new TokenWriteService();