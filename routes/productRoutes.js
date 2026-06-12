const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  deleteAllProducts,
} = require("../controllers/productController");

router.post("/add-product", createProduct);

router.get("/", getAllProducts);

router.delete("/delete-all", deleteAllProducts);

router.get("/:id", getProductById);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

module.exports = router;
