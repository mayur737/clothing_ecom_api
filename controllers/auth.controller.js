const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("node:crypto");
const { newUserMail, userPasswordResetMail, otpResendMail } = require("../utils/htmlMailer");
const { sendMail } = require("../utils/mailer");

const signup = async (req, res, next) => {
  try {
    const { name, ccode, phone, email } = req.body;
    const exists = await User.findOne({ email });
    if (exists)
      return next({ st: 400, ms: "This email address is already used" });
    const newUser = await User.create({
      name,
      ccode,
      phone,
      email,
      password,
    });

    newUser.otp = {
      code: crypto.randomInt(1e3, 1e4),
      trys: 3,
      till: Date.now() + 6e5,
    };

    await newUser.save();

    const subject = "Welcome to Clothing Ecom!";
    const body = newUserMail({
      otp: newUser.otp.code,
    });
    sendMail(newUser.email, subject, body);

    res.status(201).json({
      data: {
        message: "An OTP has been sent to your Email, Verify your account",
      },
    });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password, isAdmin } = req.body;
    console.log("req.body", req.body)
    const user = await User.findOne({ email });
    if (!user) return next({ st: 400, ms: "Account not found" });

    if (!user.isAdmin && isAdmin && !user.isSuperAdmin)
      return next({ st: 403, ms: "Access Denied" });

    if (!(await bcrypt.compare(password, user.password)))
      return next({ st: 401, ms: "Invalid Credentials" });

    if (!user.isVerified) {
      user.otp = {
        code: crypto.randomInt(1e3, 1e4),
        trys: 3,
        till: Date.now() + 6e5,
      };
      await user.save();

      const subject = "Welcome to Clothing Ecom!";
      const body = newUserMail({
        otp: user.otp.code,
      });
      sendMail(user.email, subject, body);
      return res.status(201).json({
        data: {
          message: "An OTP has been sent to your Email, Verify your account",
        },
      });
    }
    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      data: {
        token,
        message: "Logged In successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          ccode: user.ccode,
          phone: user.phone,
          isSuperAdmin: user.isSuperAdmin,
        },
      },
    });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next({ st: 400, ms: "Account not found!" });
    if (user.otp.$isEmpty()) return next({ st: 400, ms: "Invalid OTP Request" });
    if (user.otp.till.getTime() < Date.now()) return next({ st: 400, ms: "OTP Has Expired" });
    if (user.otp.trys === 0) return next({ st: 400, ms: "Too many OTPs Tried" });

    if (user.otp.code !== otp) {
      user.otp.trys -= 1;
      await user.save();
      return next({ st: 400, ms: "Incorrect OTP, Try Again" });
    }

    user.otp = {};
    user.isVerified = true;
    await user.save();

    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      data: {
        token,
        message: "Account verified successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          ccode: user.ccode,
          phone: user.phone,
          isSuperAdmin: user.isSuperAdmin,
        },
      },
    });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next({ st: 400, ms: "Account not found" });
    user.otp = {
      code: crypto.randomInt(1e3, 1e4),
      till: Date.now() + 6e5,
      trys: 3,
    };
    await user.save();
    const subject = "Password reset OTP!";
    const body = userPasswordResetMail({
      otp: user.otp.code,
    });
    sendMail(user.email, subject, body);
    return res.status(201).json({
      data: {
        message: "An OTP has been sent to your Email",
      },
    });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const verifyPasswordOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user.otp.code) return next({ st: 400, ms: "Invalid OTP Request" });
    if (user.otp.till.getTime() < Date.now()) return next({ st: 400, ms: "OTP Has Expired" });
    if (user.otp.trys === 0) return next({ st: 400, ms: "Too many OTPs Tried" });

    if (user.otp.code !== otp) {
      user.otp.trys -= 1;
      await user.save();
      return next({ st: 400, ms: "Incorrect OTP, Try Again" });
    }

    res.status(200).json({ data: { message: "OTP Verified successfully" } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, code, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next({ st: 400, ms: "Account not found" });
    user.password = password;
    user.otp = {};
    await user.save();

    res.status(200).json({ data: { message: "Password reset successfully" } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ data: { message: "Account not found" } });

    // Generate new OTP
    user.otp = {
      code: crypto.randomInt(1e3, 1e4),
      till: Date.now() + 6e5,
      trys: 3,
    };

    await user.save();
    const subject = "Welcome to Clothing Ecom!";
    const body = otpResendMail({
      otp: newUser.otp.code,
    });
    sendMail(newUser.email, subject, body);
    return res.status(201).json({
      data: {
        message: "An OTP has been sent to your Email",
      },
    });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

module.exports = {
  signup,
  login,
  verifyOtp,
  forgotPassword,
  verifyPasswordOtp,
  resetPassword,
};
