const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const validator = require("validator");

const signupSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  contact: {
    type: Number,
    required: true,
    min: 10,
  },
  aadharNo: {
    type: Number,
    required: true,
    min: 12,
  },
  password: {
    type: String,
    required: true,
  },
  avg_rating: {
    type: Number,
    default: 0,
  },
  ratings: {
    type: [Number],
    default: [],
  },
});

// static signup method
signupSchema.statics.signup = async function (
  email,
  name,
  contact,
  aadharNo,
  password
) {
  const exists_email = await this.findOne({ email });

  if (!email || !name || !contact || !aadharNo || !password) {
    throw Error("All fields must be filled");
  }

  if (!validator.isEmail(email)) {
    throw Error("Enter valid Email");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error(
      "Password must have atleat 1 capital, 1 small and 1 unique character"
    );
  }

  if (exists_email) {
    throw Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const donor = await this.create({
    email,
    name,
    contact,
    aadharNo,
    password: hash,
  });

  return donor;
};

signupSchema.statics.login = async function (email, password) {
  const donor = await this.findOne({ email });

  if (!password || !email) {
    throw Error("All fields must be filled");
  }
  if (!donor) {
    throw Error("Email does not exist");
  }

  const match = await bcrypt.compare(password, donor.password);
  if (!match) {
    throw Error("Incorrect password");
  }
  return donor;
};

signupSchema.methods.addRating = async function (rating) {
  if (rating < 1 || rating > 5) {
    throw Error("Rating must be between 1 and 5");
  }

  this.ratings.push(rating);
  this.avg_rating =
    this.ratings.reduce((acc, curr) => acc + curr, 0) / this.ratings.length;
  await this.save();

  return this;
};

const Donor = new mongoose.model("Donor", signupSchema);
module.exports = Donor;
