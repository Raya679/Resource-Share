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
  NGO_ID: {
    type:Number,
    required:true,
    unique:true,
    min:10,
  },
  password: {
    type: String,
    required: true,
  },
});

// static signup method
signupSchema.statics.signup = async function (email, name, NGO_ID, password) {
  const exists_email = await this.findOne({ email });

  if (!email || !name || !NGO_ID|| !password) {
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

  const NGO = await this.create({ email, name, NGO_ID, password: hash });

  return NGO;
};

signupSchema.statics.login = async function (email, password) {
  const NGO = await this.findOne({ email });

  if (!password || !email) {
    throw Error("All fields must be filled");
  }
  if (!NGO) {
    throw Error("Email does not exist");
  }

  const match = await bcrypt.compare(password, NGO.password);
  if (!match) {
    throw Error("Incorrect password");
  }
  return NGO;
};

const NGO= new mongoose.model("NGO", signupSchema);
module.exports = NGO;