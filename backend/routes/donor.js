const express = require("express");
const router = express.Router();

const { signupDonor, loginDonor } = require("../controllers/donorController");

router.post("/login", loginDonor);
router.post("/signup", signupDonor);

module.exports = router;
