const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    prodcut_name: { type: String, required: true },
    product_type: {
      type: String,
      required: true,
      enum: [
        "Sports Wear",
        "Casual Wear",
        "Formals",
        "Footwear",
        "Sleep Wear",
        "Ethnic Wear",
      ],
    },
    product_size: { type: String, required: true },
    product_for: { type: String, enum: ["Men", "Women", "Boy", "Girl"] },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
