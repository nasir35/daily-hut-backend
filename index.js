const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const errorHandler = require("./middleware/errorHandler");
const { connectToServer } = require("./utils/dbConnect");
const usersRoutes = require("./routes/v1/users.route.js");
const productsRoutes = require("./routes/v1/products.route.js");
const cartRoutes = require("./routes/v1/cart.route.js");
const categoryRoutes = require("./routes/v1/category.route.js");
const brandRoutes = require("./routes/v1/brands.route.js");

console.log("Express and other dependencies loaded...");

app.use(cors());
app.use(express.json());

console.log("Attempting to connect to database...");
connectToServer((err) => {
  if (!err) {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } else {
    console.error("Failed to connect to MongoDB", err);
  }
});

app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/products", productsRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/brands", brandRoutes);

app.get("/", (req, res) => {
  res.send("Daily Hut Server is working!");
});

app.all("*", (req, res) => {
  res.status(400).send("NO route found.");
});

app.use(errorHandler);

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection", error.name, error.message);
  app.close(() => {
    process.exit(1);
  });
});
