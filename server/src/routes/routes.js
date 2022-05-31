const router = require('express').Router();

router.use('/', require('./routes/main'));
router.use('/article', require('./routes/article'));
router.use('/class', require('./routes/class'));
router.use('/item', require('./routes/item'));
router.use('/occurrence', require('./routes/occurrence'));
router.use('/user', require('./routes/user'));
router.use('/upload', require('./routes/upload'));
router.use('/student', require('./routes/student'));

module.exports = router;