const router = require('express').Router();
const auth = require('../../middlewares/auth')
const StudentController = require('../../controllers/StudentController')

router.get('/', StudentController.List)
router.get('/:id', StudentController.ListOne)
router.post('/search/:id', StudentController.Search)
router.post('/', auth, StudentController.Create)
router.put('/:id', auth, StudentController.Update)
router.delete('/:id', auth, StudentController.Delete)

module.exports = router;