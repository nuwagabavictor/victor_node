const User = require('../models/user');
const bcrypt = require("bcryptjs");
const jwt = require("../../utils/jwtUtil")
const GlobalException = require("../../utils/GlobalException");


class UserWriteService {
    async registerUser(user){
        const { username, email, password, role } = user;
        console.log(user)

        if(!username || !email || !password || !role){
            throw new Error(`All Fields are required`);
        }

        const existingUser = await User.findOne({where: {
            email: email
            }})

        if(existingUser){
            throw new GlobalException("User already exists", 400);
        }

        const newPassword = await bcrypt.hash(password, 10);

        const savedUser={
            ...user,
            password: newPassword
        }
        console.log(savedUser)
        return await User.create(savedUser);
    }

    async loginUser(user){
        const { email, password } = user;

        if(!email || !password){
            throw new Error(`All Fields are required`);
        }
        const existingUser = await User.findOne({where: {
            email: email
            }})
        if(!existingUser){
            throw new Error(`User not found`);
        }

        const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
        if(!isPasswordMatch){
            throw new Error(`Invalid credentials`);
        }
        return existingUser;

    }

    async updateUser(id, user){
        const { name, email, password } = user;
        const userEmail = user.email;
        const existingUser = await User.findByPk(id);
        if(!existingUser){
            throw new Error(`User not found`);
        }
        if(userEmail && userEmail !== existingUser.email){
            const emailExists = await User.findOne({where: {
                email: userEmail
                }})
            if(emailExists){
                throw new Error(`Email already exists`);
            }
        }

        return await existingUser.update(user);
    }

    async updatePassword(id, user){
        const existingUser = await User.findByPk(id);
        if(!existingUser){
            throw new Error(`User not found`);
        }
        const newPassword = await bcrypt.hash(user.password, 10);
        return await existingUser.update({password: newPassword});
    }
}

module.exports = new UserWriteService();