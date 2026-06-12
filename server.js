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
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (server-side tools, mobile apps, curl)
    if (!origin) {
      return callback(null, true);
    }

    if (FRONTEND_ORIGINS.includes("*") || FRONTEND_ORIGINS.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS policy: origin ${origin} not allowed`));
  },
  credentials: true,
  optionsSuccessStatus: 204,
};
console.log("FRONTEND_URLS:", process.env.FRONTEND_URLS);
console.log("Allowed Origins:", FRONTEND_ORIGINS);
app.use(cors(corsOptions));

// Handle OPTIONS preflight requests explicitly without wildcard route syntax.
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return cors(corsOptions)(req, res, next);
  }

  next();
});

// Make sure allowed origins always receive explicit CORS headers.
app.use((req, res, next) => {
  const requestOrigin = req.headers.origin;
  if (!requestOrigin) {
    return next();
  }

  if (
    FRONTEND_ORIGINS.includes("*") ||
    FRONTEND_ORIGINS.includes(requestOrigin)
  ) {
    res.header("Access-Control-Allow-Origin", requestOrigin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    );
  }

  next();
});

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");

app.use("/users", userRoutes);
app.use("/products", productRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
