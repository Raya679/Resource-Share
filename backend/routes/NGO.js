const express = require("express");
const router = express.Router();

const { signupNGO, loginNGO } = require("../controllers/NGOController");

router.post("/login", loginNGO);
router.post("/signup", signupNGO);

module.exports = router;
