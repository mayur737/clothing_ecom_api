const User = require("./models/User");

const initialize = async () => {
    const admin = await User.findOne({ isSuperAdmin: true }).lean();
    if (!admin) {
        const superAdmin = new User({
            name: "Super Admin",
            email: "superAdmin@gmail.com",
            password: "superadmin",
            isSuperAdmin: true,
            ccode: "91",
            phone: "8888888888",
            isVerified: true,
            isAdmin: true,
        });
        await superAdmin.save();
        console.log("Super Admin created.");
    }
}

module.exports = initialize;
