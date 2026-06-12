const jwt = require("jsonwebtoken");

const authenticationToken = (req, res, next) => {
  const authHeader = req.header("Authorization") || req.header("authorization");
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied: no token provided" });
  }
  jwt.verify(
    token,
    process.env.JWT_SECRET || "dev_jwt_secret",
    (err, payload) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Token expired" });
        } else if (err.name === "JsonWebTokenError") {
          return res.status(403).json({ message: "Invalid token" });
        } else {
          return res.status(400).json({ message: "Token error" });
        }
      }
      req.user = payload;
      next();
    },
  );
};

module.exports = { authenticationToken };
