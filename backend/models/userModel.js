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

  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// static signup method
signupSchema.statics.signup = async function (email, username, password) {
  const exists_username = await this.findOne({ username });
  const exists_email = await this.findOne({ email });

  if (!email || !username || !password) {
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

  if (exists_username) {
    throw Error("An account already exists with this username");
  }

  if (exists_email) {
    throw Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, username, password: hash });

  return user;
};

signupSchema.statics.login = async function (username, password) {
  const user = await this.findOne({ username });

  if (!password || !username) {
    throw Error("All fields must be filled");
  }
  if (!user) {
    throw Error("Username does not exist");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect password");
  }
  return user;
};

const User = new mongoose.model("User", signupSchema);
module.exports = User;
