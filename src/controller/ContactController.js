const ContactWriteService = require('../service/ContactWriteService');
const ContactReadService = require('../service/ContactReadService');

class ContactController  {

    async createContact(req, res) {
        try{
            const contact = req.body;
            const userId = req.user.id;
            await ContactWriteService.createContact(contact, userId);
            res.status(201).json({"message": "Contact created successfully"});
        }catch (e) {
            throw e;
        }
    }

    async updateContact(req, res) {
        try{
            const id = req.params.id;
            const contact = req.body;
            const userId = req.user.id;
            const updated = await ContactWriteService.updateContact(id, contact);
            const changes = {
                phone: updated.phone,
                status: updated.status,
                type: updated.type
            }
            res.status(200).json({"message": "Contact updated successfully", changes: changes});
        }catch (e) {
            throw e;
        }
    }

    async getContact(req, res){
        try{
            const id = req.params.id;
            const response = await ContactReadService.getContactById(id);
            res.status(200).json(response);
        }   catch (e) {
            throw e;
        }
    }

    async getAllContacts(req, res){
        try{
            const userId = req.user.id;
            const response = await ContactReadService.getAllContacts(userId);
            res.status(200).json(response);
        }   catch (e) {
            throw e;
        }
    }
}

module.exports = new ContactController();