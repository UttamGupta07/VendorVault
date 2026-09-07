const nodemailer = require("nodemailer");


// =====================================================
// Gmail Transporter
// =====================================================
// Ye Gmail ke SMTP server ke through email bhejega.
//
// EMAIL_USER          = Gmail address
// EMAIL_APP_PASSWORD  = Google ka 16-character App Password
// =====================================================

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});


// =====================================================
// Send Email
// =====================================================

const sendEmail = async ({
    to,
    subject,
    text,
}) => {

    try {

        const info = await transporter.sendMail({

            from:
                process.env.EMAIL_FROM ||
                process.env.EMAIL_USER,

            to,

            subject,

            text,
        });


        console.log(
            `Email sent successfully to: ${to}`
        );

        console.log(
            `Email message ID: ${info.messageId}`
        );


        return info;

    } catch (error) {

        console.error(
            `Email sending failed to ${to}:`,
            error.message
        );

        throw error;
    }
};


module.exports = {
    sendEmail,
};