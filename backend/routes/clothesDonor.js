const express = require('express')
const { getDonatedClothesDonor, donateClothesDonor,deleteDonatedClothes } = require('../controllers/donateClothesController')
const requireDonorAuth = require('../middleware/requireDonorAuth')

const router = express.Router()
router.use(requireDonorAuth)

router.get('/getClothes', getDonatedClothesDonor)
router.post('/donateClothes',donateClothesDonor)
router.delete('/:id',deleteDonatedClothes)

module.exports = router