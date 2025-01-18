const Order = require("../Model/orderModel");
const Product = require("../Model/productModel");

const GetSaleProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const saleProduct = await Product.find({ _id: productId });

    if (!saleProduct) {
      return res.status(404).json({ message: "Sale product not found" });
    }
    res
      .status(200)
      .json({ message: "Sale product fetched successfully", saleProduct });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch sale product", error: error.message });
  }
};
const SaleProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { buyerDetails, quantitySold } = req.body;

    // Fetch the product details
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the requested quantity is available
    if (product.totalStock < quantitySold) {
      return res.status(400).json({ message: "Insufficient stock available" });
    }

    // Calculate the total amount
    const totalAmount = product.price * quantitySold;

    // Create a new order
    const newOrder = new Order({
      product: productId,
      buyerDetails,
      quantitySold,
      totalAmount,
    });

    // Save the order to the database
    await newOrder.save();

    // Update the product stock
    product.totalStock -= quantitySold;
    await product.save();

    res
      .status(200)
      .json({ message: "Sale completed successfully", order: newOrder });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to complete the sale", error: error.message });
  }
};

module.exports = { GetSaleProduct, SaleProduct };
