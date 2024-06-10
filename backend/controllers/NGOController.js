const NGO = require("../models/NGOModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

const signupNGO = async (req, res) => {
  const { email, name, NGO_ID, password } = req.body;

  try {
    const ngo = await NGO.signup(email, name, NGO_ID, password);
    const token = createToken(ngo._id);
    res.status(200).json({ email, name, NGO_ID, password, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginNGO = async (req, res) => {
  const { email, password } = req.body;

  try {
    const ngo = await NGO.login(email, password);
    const token = createToken(ngo._id);
    res.status(200).json({ email, password, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { signupNGO, loginNGO };
