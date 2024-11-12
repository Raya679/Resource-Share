const express = require("express");
const { signupDonor, loginDonor, rateDonorByNGO } = require("../controllers/donorController");
const requireNGOAuth = require('../middleware/requireNGOAuth')

const router = express.Router();

router.post("/login", loginDonor);          
router.post("/signup", signupDonor);        
router.use(requireNGOAuth)
router.post("/rateDonor", rateDonorByNGO); 

module.exports = router;
