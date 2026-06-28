
const User = require('../models/user');
const Contact = require('../models/Contact');

class ContactReadService {
    async getContactById(id){

        const res = await Contact.findByPk(id , {include: [{model: User, as: 'user'}]});
        if(!res){
            throw new Error(`Contact not found`);
        }
        return{
            phone: res.phone,
            status: res.status,
            type: res.type,
            username: res.user.username,
            email: res.user.email,
        }
    }

    async getAllContacts(userId){
        const res = await Contact.findAll({
            include: [
            {
                model: User,
                as: 'user'
            }],
            where: {
                created_by: userId,
            }
        });
        return{
            contacts: res.map(contact => ({
                phone: contact.phone,
                status: contact.status,
                type: contact.type,
                user:{
                    id: contact.user.id,
                    username: contact.user.username,
                    email: contact.user.email,

                }
            }))
        }
    }
}

module.exports = new ContactReadService();