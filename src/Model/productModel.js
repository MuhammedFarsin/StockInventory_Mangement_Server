const mongoose = require("mongoose");

// SubVariant Schema
const SubVariantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stock: { type: Number, default: 0 },
});

// Variant Schema
const VariantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  options: [SubVariantSchema],
});

// Product Schema
const ProductSchema = new mongoose.Schema({
  productCode: { type: String, unique: true, required: true },
  productName: { type: String, required: true },
  productImage: { type: String, default: null },
  price: { type: Number, required: true }, // Added price field for the product
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: null },
  isFavorite: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  hsnCode: { type: String, default: null },
  totalStock: { type: Number, default: 0 },
  variants: [VariantSchema],
});

module.exports = mongoose.model("Product", ProductSchema);
