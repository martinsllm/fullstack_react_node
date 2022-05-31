const router = require('express').Router();
const auth = require('../../middlewares/auth')
const ItemController = require('../../controllers/ItemController');

router.get('/', ItemController.List)
router.get('/:id', ItemController.ListOne)
router.post('/', auth, ItemController.Create)
router.put('/:id', auth, ItemController.Update)
router.delete('/:id', auth, ItemController.Delete)

module.exports = router;