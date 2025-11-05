const express = require("express");
const { getProductList, getProductDetails, addProductToWishList, addProductToCart } = require("../controllers/user/product.controller");

const router = express.Router();

router.get("/product-list", getProductList);
router.get("/product/:id", getProductDetails);
router.post("/add/wishlist", addProductToWishList);
router.post("/add/cart", addProductToCart);

module.exports = router;