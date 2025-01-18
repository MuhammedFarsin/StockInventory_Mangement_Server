const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Reference to the Product model
      required: true,
    },
    buyerDetails: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, // Email validation
      },
      phone: {
        type: String,
        required: true,
        match: /^\d{10}$/, // Simple phone number validation (10 digits)
      },
      address: {
        type: String,
        required: true,
      },
    },
    quantitySold: {
      type: Number,
      required: true,
      min: 1,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    saleDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create an Order model using the orderSchema
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
