const User = require("../models/User");
const jwt = require("jsonwebtoken");

const protectRoute = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!(authorization && authorization.startsWith("Bearer ")))
      return next({ st: 401, ms: "Missing Authorization Credential" });
    const token = authorization.slice(7);
    if (!token)
      return next({ st: 403, ms: "Unauthorized Access - No token provided" });
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id);
    if (!user || user.isBlocked || !user.isVerified)
      return next({ st: 403, ms: "Unauthorized Access" });
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return next({ st: 500, ms: "Unauthorized" });
  }
};

module.exports = { protectRoute };
