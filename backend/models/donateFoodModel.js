const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const foodSchema = new Schema(
  {
    foodItem: {
      type: String,
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
    expiry: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /\d{10}/.test(v);
        },
        message: (props) => `${props.value} is not a valid 10 digit number!`,
      },
    },
    booked: {
      type: Boolean,
      required: true,
      default: false,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    ngo_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    user_avg_rating: {
      type: String,
      default: "No rating yet",
    },
  },
  { timestamps: true }
);

const Food = mongoose.model("Food", foodSchema);
module.exports = Food;
