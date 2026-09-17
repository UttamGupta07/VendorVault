const nodemailer = require("nodemailer");

// =====================================================
// CONFIGURATION
// =====================================================

const MAX_EMAIL_ATTEMPTS = 3;
const RETRY_DELAY = 5000; // 5 seconds

// =====================================================
// CREATE GMAIL TRANSPORTER
// =====================================================

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});

// =====================================================
// WAIT HELPER
// =====================================================

const wait = (milliseconds) => {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
};

// =====================================================
// SEND ONE EMAIL
// =====================================================

/**
 * Sends exactly ONE email.
 *
 * Retry logic is handled by sendEmailWithRetry().
 */
const sendEmail = async ({
    to,
    subject,
    text,
}) => {
    try {
        if (!to) {
            throw new Error("Recipient email address is required");
        }

        if (!subject) {
            throw new Error("Email subject is required");
        }

        if (!text) {
            throw new Error("Email message is required");
        }

        const info = await transporter.sendMail({
            from:
                process.env.EMAIL_FROM ||
                process.env.EMAIL_USER,

            to,

            subject,

            text,
        });

        console.log("");
        console.log("📧 EMAIL SENT");
        console.log("--------------------------------------------");
        console.log("To:", to);
        console.log("Subject:", subject);
        console.log(
            "Message ID:",
            info?.messageId || "NOT_RETURNED"
        );
        console.log("--------------------------------------------");

        return {
            messageId: info?.messageId || null,

            // Keep the complete Nodemailer response
            // available if needed later.
            info,
        };
    } catch (error) {
        console.error("");
        console.error("❌ EMAIL SEND FAILED");
        console.error("--------------------------------------------");
        console.error("To:", to);
        console.error(
            "Error:",
            error?.message || "Unknown email error"
        );
        console.error("--------------------------------------------");

        throw error;
    }
};

// =====================================================
// SEND EMAIL WITH RETRY
// =====================================================

/**
 * Sends an email with maximum 3 attempts.
 *
 * IMPORTANT:
 *
 * attemptCount means the number of attempts made
 * during THIS delivery cycle.
 *
 * Example:
 *
 * Attempt 1 succeeds:
 * {
 *   success: true,
 *   attemptCount: 1,
 *   messageId: "...",
 *   error: null
 * }
 *
 * Attempt 1 + 2 + 3 fail:
 * {
 *   success: false,
 *   attemptCount: 3,
 *   messageId: null,
 *   error: "..."
 * }
 *
 * resendCount is NOT handled here.
 *
 * resendCount belongs to the Notification controller
 * because it represents manual resend operations.
 */
const sendEmailWithRetry = async ({
    to,
    subject,
    text,
}) => {
    let lastError = null;

    for (
        let attempt = 1;
        attempt <= MAX_EMAIL_ATTEMPTS;
        attempt++
    ) {
        try {
            console.log("");
            console.log("============================================");
            console.log(
                `📨 EMAIL ATTEMPT ${attempt}/${MAX_EMAIL_ATTEMPTS}`
            );
            console.log("============================================");
            console.log("To:", to);

            const emailInfo = await sendEmail({
                to,
                subject,
                text,
            });

            const messageId =
                emailInfo?.messageId || null;

            console.log("");
            console.log(
                `✅ EMAIL SUCCESSFUL ON ATTEMPT ${attempt}`
            );

            console.log(
                "📩 Message ID:",
                messageId || "NOT_RETURNED"
            );

            return {
                success: true,

                attemptCount: attempt,

                messageId,

                error: null,
            };
        } catch (error) {
            lastError = error;

            console.error("");
            console.error(
                `❌ EMAIL ATTEMPT ${attempt}/${MAX_EMAIL_ATTEMPTS} FAILED`
            );

            console.error(
                "Error:",
                error?.message || "Unknown error"
            );

            // ==========================================
            // Retry if attempts remain
            // ==========================================

            if (attempt < MAX_EMAIL_ATTEMPTS) {
                console.log(
                    `⏳ Retrying in ${
                        RETRY_DELAY / 1000
                    } seconds...`
                );

                await wait(RETRY_DELAY);
            }
        }
    }

    // =================================================
    // ALL ATTEMPTS FAILED
    // =================================================

    const finalError =
        lastError?.message ||
        "Email sending failed after 3 attempts";

    console.error("");
    console.error("============================================");
    console.error("🚨 EMAIL PERMANENTLY FAILED");
    console.error("============================================");
    console.error(
        `Attempts: ${MAX_EMAIL_ATTEMPTS}`
    );
    console.error("Error:", finalError);
    console.error("============================================");

    return {
        success: false,

        attemptCount: MAX_EMAIL_ATTEMPTS,

        messageId: null,

        error: finalError,
    };
};

// =====================================================
// VERIFY EMAIL TRANSPORTER
// =====================================================

const verifyEmailTransporter = async () => {
    try {
        await transporter.verify();

        console.log("");
        console.log("============================================");
        console.log("✅ EMAIL TRANSPORTER READY");
        console.log("============================================");
        console.log(
            "Email:",
            process.env.EMAIL_USER
        );
        console.log("============================================");

        return true;
    } catch (error) {
        console.error("");
        console.error("============================================");
        console.error("❌ EMAIL TRANSPORTER VERIFICATION FAILED");
        console.error("============================================");
        console.error(
            "Error:",
            error?.message || "Unknown error"
        );
        console.error("============================================");

        return false;
    }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
    sendEmail,
    sendEmailWithRetry,
    verifyEmailTransporter,
};
