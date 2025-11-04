const nodemailer = require("nodemailer");
const Smtp = require("../models/Smtp");

exports.sendMail = async (to = "", subject = "", text = "") => {
  console.log("Send Mail:", { to, subject, text });

  try {
    const smtp = await Smtp.findOne({ isDefault: true }).lean();
    if (!smtp) throw new Error("No default smtp found");
    const transporter = nodemailer.createTransport({
      secure: smtp.secure !== "None",
      host: smtp.host,
      port: smtp.port,
      auth: {
        user: smtp.userName,
        pass: smtp.password,
      },
    });

    const verify = await transporter.verify();
    console.log("SMTP verification:", verify);

    const from = `${smtp.fromName} <${smtp.fromEmail}>`;

    const { response } = await transporter.sendMail({
      from,
      to,
      subject,
      html: text,
    });

    console.log("Email sent response:", response);
  } catch (error) {
    console.log("Send mail error", error);
  }
};
