const express = require('express');
const router = express.Router();
const UserController = require('../controller/userController');
const authMiddleware = require('../../middleware/authMiddleware');

router.post("/register", (req, res)=> UserController.registerUser(req, res));
router.post("/login", (req, res)=> UserController.loginUser(req, res));
router.get("/:id", authMiddleware, (req, res) =>UserController.getUser(req, res));
router.get("",(req, res)=> UserController.getAllUsers(req, res));
router.put("/update/:id", authMiddleware, (req, res)=> UserController.updateUser(req, res));
router.put("/update-password/:id", authMiddleware, (req, res)=> UserController.updatePassword(req, res));
router.post("/refreshToken", (req, res)=> UserController.refreshToken(req, res))
router.post("/verify-otp", (req, res)=> UserController.verifyOtp(req, res))


module.exports = router;