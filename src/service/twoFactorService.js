const sequelize = require('../../config/sequelize');
const tokenConstants = require('../constants/tokenConstants');
const bcrypt = require('bcryptjs')
const jwt = require("../../utils/jwtUtil")
const tokenWriteService = require('./tokenWriteService');
const User = require('../models/user');
const TwoFactor = require('../models/twoFactor');

class TwoFactorService {

    async generateOtp(user){
        return await sequelize.transaction( async transaction =>{

            try{
                const existingToken = await TwoFactor.findOne({where: {
                    user_id: user.id,
                    }})

                const expired = existingToken && existingToken.expires_at < new Date();
                const used = existingToken && existingToken.is_used === true;

                const isValid = !expired && !used;

                if (isValid) {
                    throw new Error("You already have an OTP in progress. Please wait for it to expire.");
                }

                const otp = tokenConstants.generateOtp().toString();
                const expiresAt = new Date(Date.now() + tokenConstants.TWO_FACTOR_EXPIRY);
                const hashedOTP = await bcrypt.hash(otp, 10);
                await TwoFactor.create({
                    secret: hashedOTP,
                    expires_at: expiresAt,
                    user_id: user.id
                }, {transaction});
                return otp;
            }catch (e) {
                throw e;
            }

        });
    }

    async verifyOtp(email, otp){

        return  await sequelize.transaction(async transaction => {
            try {

                const existingUser = await User.findOne({where:
                        { email: email},transaction
                })

                if (!existingUser) {
                    throw new Error("User not found");
                }

                const existingTwoFactor = await TwoFactor.findOne({where: {
                    user_id: existingUser.id
                },
                    order: [['created_at', 'DESC']],
                    include: [{
                        model: User,
                        as: 'user'
                    }], transaction
                })

                if (!existingTwoFactor) {
                    throw new Error("Two factor not found");
                }
                if (existingTwoFactor.expires_at < new Date()) {
                    throw new Error("OTP expired");
                }
                if (existingTwoFactor.is_used) {
                    throw new Error("OTP already used");
                }

                const isHashTrue = await bcrypt.compare(otp, existingTwoFactor.secret);

                if (!isHashTrue) {
                    throw new Error("Invalid OTP");
                }

                existingTwoFactor.is_used = true;
                await existingTwoFactor.save({transaction});

                const jwtToken = jwt.generateToken(existingUser);
                const refreshToken = await tokenWriteService.generateToken(existingUser);


                return {
                    id: existingUser.id,
                    email: existingUser.email,
                    role: existingUser.role,
                    accessToken: jwtToken,
                    refreshToken: refreshToken
                };
            }catch (e) {
                throw e;
            }
        });
    }

}

module.exports = new TwoFactorService();