const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("node:crypto");
const { newUserMail } = require("../utils/htmlMailer");
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
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next({ st: 400, ms: "Account not found" });

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
        otp: newUser.otp.code,
      });
      sendMail(newUser.email, subject, body);
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

const verifyOtp = async (req, res, next) => {};

const requestChangePassword = async (req, res, next) => {};

const changePassword = async (req, res, next) => {};

module.exports = {
  signup,
  login,
  verifyOtp,
  requestChangePassword,
  changePassword,
};
