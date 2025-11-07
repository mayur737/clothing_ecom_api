const nodemailer = require("nodemailer");

exports.sendMail = async (to = "", subject = "", text = "") => {
  console.log("Send Mail:", { to, subject, text });
  const smtp = {
    host: process.env.EMHOST,
    port: process.env.EMPORT,
    user: process.env.EMUSER,
    pass: process.env.EMPASS,
    from: process.env.EMFROM
  }

  try {
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

    const from = smtp.from;

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
