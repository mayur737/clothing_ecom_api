const express = require("express");
const { getProductList, getProductDetails, addProductToWishList, addProductToCart, removeProductfromCart, removeProductFromWishlist, moveProductFromWishlistToCart } = require("../controllers/user/product.controller");

const router = express.Router();

router.get("/product-list", getProductList);
router.get("/product/:id", getProductDetails);
router.post("/add//:id", addProductToWishList);
router.post("/add/cart/:id", addProductToCart);
router.post("/remove/cart/:id", removeProductfromCart);
router.post("/remove/wishlist/:id", removeProductFromWishlist);
router.post("/move/cart/:id", moveProductFromWishlistToCart);

module.exports = router;