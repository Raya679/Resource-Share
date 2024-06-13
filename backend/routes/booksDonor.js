const express = require('express')
const { getDonatedBooksDonor, donateBooksDonor,deleteDonatedBooks } = require('../controllers/donateBooksController')
const requireDonorAuth = require('../middleware/requireDonorAuth')

const router = express.Router()
router.use(requireDonorAuth)

router.get('/getBook', getDonatedBooksDonor)
router.post('/donateBook',donateBooksDonor)
router.delete('/:id',deleteDonatedBooks)

module.exports = router