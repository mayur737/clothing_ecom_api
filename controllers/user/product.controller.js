const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const WishList = require("../../models/Wishlist");

const getProductList = async (req, res, next) => {
    try {
        const { n = 1, p = 0 } = req.body
        const filter = {};
        const products = await Product.find(filter).populate("image", "url").skip(p * n)
            .limit(+n)
            .sort("-_id")
            .lean();

        const count = await Product.countDocuments(filter)

        res.status(200).json({ data: { products, count } })
    } catch (error) {
        console.log(error);
        next({ st: 500, ms: error.message })
    }
};

const getProductDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) return next({ st: 400, ms: "Product not found" })
        res.status(200).json({ data: { product } })
    } catch (error) {
        console.log(error);
        next({ st: 500, ms: error.message })
    }
};

const addProductToWishList = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.body;
        const wishlist = await WishList.findOne({ userId: userId });
        if (!wishlist) {
            await WishList.create({
                userId: id,
                products: []
            })
        }
        if (id && !wishlist.products.includes(id)) {
            wishlist.products.push(id);
        }
        await wishlist.save();
        res.status(200).json({ data: { message: "Product added to wishlist successfully" } })
    } catch (error) {
        console.log(error);
        next({ st: 500, ms: error.message })
    }
};

const addProductToCart = async (res, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.body;
        const cart = await Cart.findOne({ userId: userId });
        if (!cart) {
            await Cart.create({
                userId: id,
                products: []
            })
        }
        if (id && !cart.products.includes(id)) {
            cart.products.push(id);
        }
        await cart.save();
        res.status(200).json({ data: { message: "Product added to cart successfully" } })
    } catch (error) {
        console.log(error);
        next({ st: 500, ms: error.message })
    }
};

module.exports = { getProductDetails, getProductList, addProductToCart, addProductToWishList }