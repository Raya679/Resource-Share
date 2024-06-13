const express = require('express')
const { getDonatedClothesNGO, bookDonatedClothes,getBookedClothes } = require('../controllers/donateClothesController')
const requireNGOAuth = require('../middleware/requireNGOAuth')

const router = express.Router()
router.use(requireNGOAuth)

router.get('/getClothes', getDonatedClothesNGO)
router.put('/bookClothes/:id',bookDonatedClothes)
router.get('/getBookedClothes',getBookedClothes)

module.exports = router


  