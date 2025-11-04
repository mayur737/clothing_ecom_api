const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
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
    price: { type: String },
    is_active: { type: Boolean, default: true },
    image: { type: mongoose.Schema.Types.ObjectId, ref: "FileObject" },
    size: [{ type: String, required: true }],
    color: { type: String },
    rating: [{ type: Number, min: 0, max: 5, default: 0 }],
    num_reviews: { type: Number, default: 0 },
    product_for: { type: String, enum: ["Men", "Women", "Boy", "Girl"] },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
