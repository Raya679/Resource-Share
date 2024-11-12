const Donor = require("../models/donorModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

const signupDonor = async (req, res) => {
  const { email, name, contact, aadharNo, password } = req.body;

  try {
    const donor = await Donor.signup(email, name, contact, aadharNo, password);
    const token = createToken(donor._id);
    res.status(200).json({ email, name, contact, aadharNo, password, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginDonor = async (req, res) => {
  const { email, password } = req.body;

  try {
    const donor = await Donor.login(email, password);
    const token = createToken(donor._id);
    res.status(200).json({ email, password, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const rateDonorByNGO = async (req, res) => {
  const { donorId, rating } = req.body;
  console.log(donorId);
  console.log(rating);

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  try {
    const donor = await Donor.findById(donorId);
    if (!donor) {
      return res.status(404).json({ error: "Donor not found" });
    }

    await donor.addRating(rating);
    console.log(donor.ratings);
    res.status(200).json({
      message: "Rating added successfully",
      donor: {
        email: donor.email,
        name: donor.name,
        avg_rating: donor.avg_rating,
        ratings: donor.ratings,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { signupDonor, loginDonor, rateDonorByNGO };
