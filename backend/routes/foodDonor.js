const express = require('express')
const { getDonatedFoodsDonor, donateFoodDonor,deleteDonatedFood } = require('../controllers/donateFoodController')
const requireDonorAuth = require('../middleware/requireDonorAuth')

const router = express.Router()
router.use(requireDonorAuth)

router.get('/getFood', getDonatedFoodsDonor)
router.post('/donateFood',donateFoodDonor)
router.delete('/:id',deleteDonatedFood)

module.exports = router