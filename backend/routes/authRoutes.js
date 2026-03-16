const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

/* CUSTOMER */
router.post("/customer/register", authController.customerRegister);
router.post("/customer/login", authController.customerLogin);

/* INTERNAL */
router.post("/internal/register", authController.internalRegister);
router.post("/internal/login", authController.internalLogin);

/* GET LOGGED IN INTERNAL USER */
router.get("/internal/me", protect, authController.getMe);

module.exports = router;
