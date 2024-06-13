const express = require('express')
const { getDonatedBooksNGO, bookDonatedBooks,getBookedBooks } = require('../controllers/donateBooksController')
const requireNGOAuth = require('../middleware/requireNGOAuth')

const router = express.Router()
router.use(requireNGOAuth)

router.get('/getBooks', getDonatedBooksNGO)
router.put('/bookBooks/:id',bookDonatedBooks)
router.get('/getBookedBooks',getBookedBooks)

module.exports = router


  