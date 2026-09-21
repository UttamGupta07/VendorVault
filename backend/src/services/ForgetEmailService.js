const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// Test email connection
const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log("✅ Email server is ready");
  } catch (error) {
    console.error("❌ Email server error:", error);
  }
};

verifyEmailConnection();

const sendPasswordResetEmail = async (
  email,
  name,
  resetUrl
) => {
  try {
    console.log("📧 Sending password reset email...");
    console.log("To:", email);
    console.log("From:", process.env.EMAIL_FROM);

    const mailOptions = {
      from: `"VendorVault" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Reset Your VendorVault Password",

      html: `
        <div style="
          margin: 0;
          padding: 40px 20px;
          background-color: #F4EFF3;
          font-family: Arial, sans-serif;
        ">

          <div style="
            max-width: 600px;
            margin: auto;
            background: white;
            border-radius: 12px;
            padding: 35px;
          ">

            <h2 style="color: #3A3550;">
              Reset Your Password
            </h2>

            <p style="color: #585272;">
              Hello ${name || "User"},
            </p>

            <p style="
              color: #585272;
              line-height: 1.6;
            ">
              We received a request to reset your
              VendorVault account password.
            </p>

            <div style="
              text-align: center;
              margin: 30px 0;
            ">

              <a
                href="${resetUrl}"
                style="
                  display: inline-block;
                  padding: 13px 25px;
                  background-color: #585272;
                  color: white;
                  text-decoration: none;
                  border-radius: 8px;
                  font-weight: bold;
                "
              >
                Reset Password
              </a>

            </div>

            <p style="
              color: #8A82A6;
              font-size: 13px;
            ">
              This link will expire in 15 minutes.
            </p>

            <p style="
              color: #8A82A6;
              font-size: 13px;
            ">
              If you did not request this password reset,
              you can safely ignore this email.
            </p>

          </div>
        </div>
      `,
    };

    const info =
      await transporter.sendMail(mailOptions);

    console.log(
      "✅ Password reset email sent:",
      info.messageId
    );

    return info;

  } catch (error) {
    console.error(
      "❌ Password reset email failed:",
      error
    );

    throw error;
  }
};


const sendPasswordResetConfirmationEmail = async (
  email,
  name
) => {
  try {
    const mailOptions = {
      from: `"VendorVault" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject:
        "Your VendorVault Password Has Been Reset",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          padding: 40px;
          background: #F4EFF3;
        ">

          <div style="
            max-width: 600px;
            margin: auto;
            background: white;
            padding: 35px;
            border-radius: 12px;
          ">

            <h2 style="color: #3A3550;">
              Password Reset Successful
            </h2>

            <p style="color: #585272;">
              Hello ${name || "User"},
            </p>

            <p style="color: #585272;">
              Your VendorVault password has been
              successfully changed.
            </p>

            <p style="color: #585272;">
              You can now log in using your new password.
            </p>

          </div>

        </div>
      `,
    };

    const info =
      await transporter.sendMail(mailOptions);

    console.log(
      "✅ Confirmation email sent:",
      info.messageId
    );

    return info;

  } catch (error) {
    console.error(
      "❌ Confirmation email failed:",
      error
    );

    throw error;
  }
};


module.exports = {
  sendPasswordResetEmail,
  sendPasswordResetConfirmationEmail,
};