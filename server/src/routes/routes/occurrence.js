const router = require('express').Router();
const auth = require('../../middlewares/auth')
const OccurrenceController = require('../../controllers/OccurrenceController')

router.get('/', OccurrenceController.List)
router.get('/:id', OccurrenceController.ListOne)
router.get('/student/:id', OccurrenceController.ListByStudent)
router.post('/', auth, OccurrenceController.Create),
router.put('/:id', auth, OccurrenceController.Update)
router.delete('/:id', auth, OccurrenceController.Delete)

module.exports = router;