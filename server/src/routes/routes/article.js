const router = require('express').Router();
const auth = require('../../middlewares/auth')
const ArticleController = require('../../controllers/ArticleController')

router.get('/', ArticleController.List)
router.get('/:id', ArticleController.ListOne)
router.post('/', auth, ArticleController.Create)
router.put('/:id', auth, ArticleController.Update)
router.delete('/:id', auth, ArticleController.Delete)


module.exports = router;