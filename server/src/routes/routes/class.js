const router = require('express').Router();
const auth = require('../../middlewares/auth')
const ClassController = require('../../controllers/ClassController')

router.get('/', ClassController.List)
router.get('/:id', ClassController.ListOne)
router.post('/', auth, ClassController.Create)
router.put('/:id', auth, ClassController.Update)
router.delete('/:id', auth, ClassController.Delete)

module.exports = router;