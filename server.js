const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("DB connected Successfully.");
  })
  .catch((error) => {
    console.log(`Error: ${error}`);
  });

const app = express();

app.use(express.json());

// Allow frontend origins from env or sensible defaults
const FRONTEND_ORIGINS = (
  process.env.FRONTEND_URLS ||
  "http://localhost:5173,https://your-app.vercel.app"
).split(",");

app.use(
  cors({
    origin: FRONTEND_ORIGINS,
    credentials: true,
  }),
);

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");

app.use("/users", userRoutes);
app.use("/products", productRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
