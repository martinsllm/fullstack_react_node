const router = require('express').Router();
const auth = require('../../middlewares/auth')
const UploadController = require('../../controllers/UploadController')

const multer = require('multer');
const upload = multer({})

router.get('/', UploadController.List)
router.post('/:id', auth, upload.single('photo'), UploadController.Create)
router.put('/:id', auth, upload.single('photo'), UploadController.Update)

module.exports = router;