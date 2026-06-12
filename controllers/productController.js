const Product = require("../models/Product");

const createProduct = async (req, res) => {
  try {
    // If array is sent
    if (Array.isArray(req.body)) {
      const products = await Product.insertMany(req.body);

      return res.status(201).json({
        message: `${products.length} products created successfully`,
        products,
      });
    }

    // Single product
    const { name, category, price, description, stock, image_url } = req.body;

    if (!name || !category || !price || !image_url) {
      return res.status(400).json({
        message: "Name, category, price and image_url are required",
      });
    }
    const product = new Product({
      name,
      category,
      price,
      description,
      stock,
      image_url,
    });

    const savedProduct = await product.save();

    res.status(201).json({
      message: "Product created successfully",
      product: savedProduct,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.minPrice) {
      filter.price = { ...filter.price, $gte: Number(req.query.minPrice) };
      console.log(filter); //{ price: { '$gte': 500 } }
    }
    if (req.query.maxPrice) {
      filter.price = { ...filter.price, $lte: Number(req.query.maxPrice) };
      console.log(filter);
    }

    if (req.query.category) {
      filter.category = req.query.category;
      console.log(filter); //{ price: { '$gte': 100, '$lte': 1000 }, category: 'Electronics' }
    }

    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: "i" };
      console.log(filter);
    }

    const sortObj = {};
    if (req.query.sortBy) {
      const order = req.query.order === "desc" ? -1 : 1;
      sortObj[req.query.sortBy] = order;
      console.log(sortObj);
    }

    const products = await Product.find(filter).sort(sortObj);
    res.status(200).json({
      count: products.length,
      products,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
const deleteAllProducts = async (req, res) => {
  try {
    const result = await Product.deleteMany({});

    res.status(200).json({
      message: "All products deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  deleteAllProducts,
};
