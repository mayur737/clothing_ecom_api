const newUserMail = ({ otp }) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New User Added</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .details {
            margin: 15px 0;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #555;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">Welcome to Clothing Ecom!</div>
        <p>Here is your OTP for verification:</p>
        <div class="details">
            <p><strong>Do not share this OTP with anyone else.</strong></p>
            <p><strong>OTP:</strong> ${otp}</p>
        </div>
        <div class="footer">
            <p>If you have any questions, please contact us.</p>
            <p>Regards,<br><b>Clothing Ecom</b></p>
        </div>
    </div>
</body>
</html>
`;
};

const userPasswordResetMail = ({ otp }) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New User Added</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .details {
            margin: 15px 0;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #555;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">Password Reset OTP!</div>
        <p>Here is your OTP for Password change:</p>
        <div class="details">
            <p><strong>Do not share this OTP with anyone else.</strong></p>
            <p><strong>OTP:</strong> ${otp}</p>
        </div>
        <div class="footer">
            <p>If you have any questions, please contact us.</p>
            <p>Regards,<br><b>Clothing Ecom</b></p>
        </div>
    </div>
</body>
</html>
`;
};

const otpResendMail = ({ otp }) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New User Added</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .details {
            margin: 15px 0;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #555;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">OTP!</div>
        <p>Here is your OTP:</p>
        <div class="details">
            <p><strong>Do not share this OTP with anyone else.</strong></p>
            <p><strong>OTP:</strong> ${otp}</p>
        </div>
        <div class="footer">
            <p>If you have any questions, please contact us.</p>
            <p>Regards,<br><b>Clothing Ecom</b></p>
        </div>
    </div>
</body>
</html>
`;
};

module.exports = { newUserMail, userPasswordResetMail, otpResendMail };
