const router = require('express').Router();
const auth = require('../../middlewares/auth')
const UserController = require('../../controllers/UserController');

router.get('/', UserController.List)
router.get('/:id', UserController.ListOne)
router.get('/email/:id', UserController.ListByEmail)
router.post('/', UserController.Create)
router.put('/:id', auth, UserController.Update)
router.delete('/:id', auth, UserController.Delete)

module.exports = router;