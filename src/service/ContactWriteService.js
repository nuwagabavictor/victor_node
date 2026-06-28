const User = require('../models/user');
const Contact = require('../models/Contact');
const sequelize = require("../../config/sequelize");
const GlobalException = require("../../utils/GlobalException");

class ContactWriteService {

    async createContact(contact, userId){

        return await sequelize.transaction(async transaction => {

            const {phone, type} = contact;
            const created_by = userId;

            const existingPhone = await Contact.findOne({where: {
                phone: phone
                }})
            if (existingPhone) {
                throw new Error(`Phone number already exists`);
            }

            let user = null;
            if (created_by !== null) {
                user = await User.findByPk(created_by);
            }

            if(!user){
               throw new Error(`User not found`);
            }

            return await Contact.create({
                phone: phone,
                type: type,
                created_by: user.id,
                status: 'ACTIVE',
            }, {transaction});
        })
    }

    async updateContact(id, contact){

        return sequelize.transaction(async transaction => {
            try {
                const {phone, type, status} = contact;
                const existingContact = await Contact.findByPk(id);
                if(!existingContact){
                    throw new GlobalException(`Contact not found`);
                }

                //status update
                if (status && status !== existingContact.status){
                    existingContact.status = status;
                }

                //type update
                if (type && type !== existingContact.type){
                    existingContact.type = type;
                }

                if (phone && phone !== existingContact.phone){
                    const findPhone = await Contact.findOne({where: {
                        phone: phone
                        }})
                    if (findPhone){
                        throw new Error(`Phone number already exists`);
                    }
                    existingContact.phone = phone;
                }
                const res = await existingContact.save({transaction});
                return{
                    phone: res.phone,
                    status: res.status,
                    type: res.type,
                }
            }catch (e) {
                throw e;
            }
        })
    }
}

module.exports = new ContactWriteService();