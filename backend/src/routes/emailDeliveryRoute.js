const {getEmailDeliveryRecords,resendNotificationEmail
  ,deleteAllSentEmails
}=require('../controller/emailDeliveryController.js');
const  express =require('express');
const protect = require('../middleware/authMiddleware.js');
const authorizeRole=require("../middleware/authorizeRoles.js");
const router = express.Router();


router.get('/', protect, authorizeRole('COMPLIANCE_OFFICER'), getEmailDeliveryRecords);
router.delete(
  "/sent",
  protect,
  deleteAllSentEmails
);

router.post(
  "/:notificationId/resend",
  protect,
  resendNotificationEmail
);


module.exports = router;