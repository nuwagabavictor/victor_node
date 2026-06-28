const UserWriteService = require('../service/userWriteService');
const jwt = require("../../utils/jwtUtil")
const UserReadService = require('../service/userReadService');
const accessToken = require('../service/tokenWriteService');
const tokenConstants = require('../constants/tokenConstants');
const TwoFactorService = require('../service/twoFactorService');

class UserController {
    async registerUser(req, res) {
        try{
            const user = req.body;
            console.log(user)
            const newUser = await UserWriteService.registerUser(user);
            res.status(201).json({ message: 'User created successfully'});
        }   catch (e) {
            console.log(e);
            res.status(400).json({ message: e.message });
        }
    }

    async loginUser(req, res) {
        try{
            const user = req.body;
            const loggedUser = await UserWriteService.loginUser(user);
            if (loggedUser.twofactor_enabled) {
                const otp = await TwoFactorService.generateOtp(loggedUser);
                return res.status(200).json({ message: 'Two factor enabled', otp: otp });
            }
            const token = jwt.generateToken(loggedUser);
            const refreshToken = accessToken.generateToken(loggedUser);
            const UserData = {
                id: loggedUser.id,
                name: loggedUser.name,
                email: loggedUser.email,
                role: loggedUser.role,
                token: token,
            }
            res.cookie('refreshToken', refreshToken, tokenConstants.refreshCookieOptions);
            res.status(200).json({ message: 'User logged in successfully', user: UserData });
        }   catch (e) {
            console.log(e);
            res.status(400).json({ message: e.message });
        }
    }

    async getAllUsers(req, res) {
        try{
            const users = await UserReadService.getAllUsers();
            const usersData = users.map(user => ({
                id: user.id,
                name: user.username,
                email: user.email,
                role: user.role,
            }))
            res.status(200).json({ message: 'Users fetched successfully', users: usersData });
        }   catch (e) {
            console.log(e);
        }
    }

    async getUser(req, res) {
        try{
            const user = await UserReadService.getUserById(req.params.id);
            const userData = {
                id: user.id,
                email: user.email,
                role: user.role
            }
            res.status(200).json({ message: 'User fetched successfully', user: userData });
        }catch (e) {
            res.status(404).json({ message: 'User not found' });
        }
    }

    async getUserByEmail(req, res) {
        try{
            const email = req.params.email;
            const user = await UserReadService.getByEmail(email);
            const userData = {
                id: user.id,
                email: user.email,
                role: user.role
            }
            res.status(200).json({ message: 'User fetched successfully', user: userData });
        }catch (e) {
            res.status(404).json({ message: 'User not found' });
        }
    }

    async updateUser(req, res) {
        try{
            const id = req.params.id;
            const user = req.body;
            const updatedUser = await UserWriteService.updateUser(id, user);
            res.status(200).json({ message: 'User updated successfully', id: updatedUser.id });
        }catch (e) {
            console.log(e);
            res.status(400).json({ message: e.message });
        }
    }

    async updatePassword(req, res) {
        try{
            const id = req.params.id;
            const user = req.body;
            const updatedUser = await UserWriteService.updatePassword(id, user);
            res.status(200).json({ message: 'Password updated successfully', id: updatedUser.id });
        }catch (e) {
            console.log(e);
            res.status(400).json({ message: e.message });
        }
    }

    async refreshToken(req, res) {
        try{
            const token = req.cookies['refreshToken'];
            console.log(token)
            if (!token) {
                return res.status(401).json({message: 'Access denied. No token provided.'});
            }
            const tokenResponse = await accessToken.createAccessToken(token);

            res.cookie('refreshToken', tokenResponse.refreshToken, tokenConstants.refreshCookieOptions);
            res.status(200).json(
                {
                    id: tokenResponse.id,
                    email: tokenResponse.email,
                    role: tokenResponse.role,
                    accessToken: tokenResponse.accessToken,
                }
            )
        }catch (e) {
            res.status(400).json({ message: e.message });
        }
    }

    async verifyOtp(req, res) {
        try{
            const { otp, email } = req.body;
            const user = await TwoFactorService.verifyOtp(email, otp);
            const UserData = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                accessToken: user.accessToken,
            }
            res.cookie('refreshToken', user.refreshToken, tokenConstants.refreshCookieOptions);
            res.status(200).json(UserData);
        }catch (e) {
            console.log(e);
            res.status(400).json({ message: e.message });
        }
    }

}

module.exports = new UserController();