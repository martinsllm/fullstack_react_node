const router = require('express').Router();
const SessionController = require('../../controllers/SessionController');

router.post('/login', SessionController.Login)
router.post('/send-email', SessionController.SendEmail)
router.post('/change-password', SessionController.ChangePassword)

module.exports = router;