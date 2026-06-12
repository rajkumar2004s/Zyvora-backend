const express = require("express");
const router = express.Router();
module.exports = router;

const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const { registerUser, loginUser } = require("../controllers/authController");
const { authenticationToken } = require("../middleware/authenticationToken");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", authenticationToken, getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
