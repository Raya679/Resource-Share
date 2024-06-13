require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// routes
const donorRoutes = require("./routes/donor");
const NGORoutes = require("./routes/NGO")
const foodDonorRoutes = require("./routes/foodDonor")
const foodNGORoutes = require("./routes/foodNGO")
const booksDonorRoutes = require("./routes/booksDonor")
const booksNGORoutes = require("./routes/booksNGO")
const clothesDonorRoutes = require("./routes/clothesDonor")
const clothesNGORoutes = require("./routes/clothesNGO")

const app = express();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use("/api/donor", donorRoutes);
app.use("/api/NGO", NGORoutes)
app.use("/api/donor",foodDonorRoutes)
app.use("/api/NGO", foodNGORoutes)
app.use("/api/donor",booksDonorRoutes)
app.use("/api/NGO", booksNGORoutes)
app.use("/api/donor",clothesDonorRoutes)
app.use("/api/NGO", clothesNGORoutes)

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("connected to db & listening to port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
