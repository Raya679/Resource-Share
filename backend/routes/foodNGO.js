const express = require('express')
const { getDonatedFoodsNGO, bookDonatedFood,getBookedFood } = require('../controllers/donateFoodController')
const requireNGOAuth = require('../middleware/requireNGOAuth')

const router = express.Router()
router.use(requireNGOAuth)

router.get('/getFood', getDonatedFoodsNGO)
router.put('/bookFood/:id',bookDonatedFood)
router.get('/getBookedFood',getBookedFood)

module.exports = router


  