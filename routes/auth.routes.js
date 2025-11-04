const express = require("express");
const { login, verifyOtp, forgotPassword, verifyPasswordOtp, signup, resetPassword } = require("../controllers/auth.controller");


const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password", forgotPassword);
router.post("/verify-password-otp", verifyPasswordOtp);
router.post("/reset-password", resetPassword);
// router.post("/resend-otp", resendOtp);
// router.get("/profile", protectRoute, getProfile);
// router.put("/profile", protectRoute, putProfile);

module.exports = router