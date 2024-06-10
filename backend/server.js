require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// routes
const donorRoutes = require("./routes/donor");
const NGORoutes = require("./routes/NGO")
const foodRoutesDonor = require("./routes/foodDonor")
const foodRoutesNGO = require("./routes/foodNGO")

const app = express();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use("/api/donor", donorRoutes);
app.use("/api/NGO", NGORoutes)
app.use("/api/donor",foodRoutesDonor)
app.use("/api/NGO", foodRoutesNGO)

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
