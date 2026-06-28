const ContactController = require('../controller/ContactController');
const authMiddleware = require('../../middleware/authMiddleware');

const router = require('express').Router();

router.post("/create", authMiddleware, (req, res) => ContactController.createContact(req, res));
router.put("/update/:id", authMiddleware, (req, res) => ContactController.updateContact(req, res));
router.get("/:id", authMiddleware, (req, res) => ContactController.getContact(req, res));
router.get("", authMiddleware, (req, res) => ContactController.getAllContacts(req, res));

module.exports = router;