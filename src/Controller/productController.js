const Product = require("../Model/productModel");
const Order = require("../Model/orderModel");

const showProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
}
const dashboard = async (req, res) => {
  try {
    const view = req.query.view || 'daily';
    let matchStage = {};
    let groupStage = {};

    // Set group stages based on the view (daily, monthly, yearly)
    if (view === 'daily') {
      groupStage = {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$saleDate" } },
        totalRevenue: { $sum: "$totalAmount" },
      };
    } else if (view === 'monthly') {
      groupStage = {
        _id: { $dateToString: { format: "%Y-%m", date: "$saleDate" } },
        totalRevenue: { $sum: "$totalAmount" },
      };
    } else if (view === 'yearly') {
      groupStage = {
        _id: { $dateToString: { format: "%Y", date: "$saleDate" } },
        totalRevenue: { $sum: "$totalAmount" },
      };
    }

    // Aggregate data for total revenue and sales data
    const revenueData = await Order.aggregate([
      { $match: matchStage },
      { $group: groupStage },
      { $sort: { _id: 1 } },
    ]);

    // Aggregate data for overall statistics (Total Products, Total Sales, Total Revenue)
    const totalProduct = await Product.countDocuments();  // Total product count
    const totalSales = await Order.countDocuments();     // Total sales count
    const totalRevenueData = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = totalRevenueData[0]?.totalRevenue || 0; // Total revenue

    // Extract labels and sales data for the chart
    const labels = revenueData.map(item => item._id);
    const salesData = revenueData.map(item => item.totalRevenue);

    // Send the response with overall details and chart data
    res.status(200).json({
      totalProduct,
      totalSales,
      totalRevenue,
      labels,
      salesData,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};


const getProduct = async (req, res) => {
  try {
    const product = await Product.find();
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res
      .status(200)
      .json({ message: "Products fetched successfully", products: product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get products", error: error.message });
  }
};
const createProduct = async (req, res) => {
  try {
    const {
      productCode,
      productName,
      hsnCode,
      totalStock,
      isFavorite,
      active,
      variants,
      price,
    } = req.body;

    const productImage = req.file ? req.file.filename : "";

    let parsedVariants;
    if (typeof variants === "string") {
      try {
        parsedVariants = JSON.parse(variants);
      } catch (error) {
        return res.status(400).json({ message: "Invalid format for variants" });
      }
    } else {
      parsedVariants = variants;
    }

    // Creating the new product including price
    const newProduct = new Product({
      productCode,
      productName,
      productImage, 
      hsnCode,
      totalStock,
      price, // Include product price here
      isFavorite,
      active,
      variants: parsedVariants,
    });

    await newProduct.save();

    return res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error("Error creating product:", error.message);
    return res
      .status(500)
      .json({ message: "Failed to create product", error: error.message });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findOneAndDelete(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully", product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete product", error: error.message });
  }
};
const GetEditProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product fetched successfully", product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get product", error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { productCode, productName, hsnCode, totalStock, isFavorite, active, variants, price } = req.body;

    let updateData = {
      productCode,
      productName,
      hsnCode,
      totalStock,
      price, // Update product price here
      isFavorite: isFavorite === 'true',
      active: active === 'true',
    };

    if (variants) {
      updateData.variants = typeof variants === 'string' ? JSON.parse(variants) : variants;
    }

    if (req.file) {
      updateData.productImage = req.file.filename;
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { showProducts,createProduct, getProduct, deleteProduct, GetEditProduct, updateProduct, dashboard };
