const User = require('../models/user');

class UserReadService {

    async getUserById(id){
        try {
            return await User.findByPk(id);
        }catch (e){
            console.log(e);
        }
    }

    async getByEmail(email){
        try{
            const res = await User.findOne({where: {
                email: email
            }})
            return res;
        }catch (e) {
            console.log(e);
        }
    }

    async getAllUsers(){
        try {
            return await User.findAll();
        }catch (e){
            console.log(e);
        }
    }
}

module.exports = new UserReadService();