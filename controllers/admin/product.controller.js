const Product = require("../../models/Product");

const addProduct = async (req, res, next) => {
    try {
        const { name, type, price, is_active, image, size, color } = req.body;
        await Product.create({
            name, type, price, is_active, image, size, color
        });
        res.status(200).json({ data: { message: "Product added successfully" } })
    } catch (error) {
        console.log(error);
        next({ st: 500, ms: error.message })
    }
}

const getAllProducts = async (req, res, next) => {
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

const getProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate("image", "url");
        if (!product) next({ st: 400, ms: "Product not found" })
        res.status(200).json({ data: { product } })
    } catch (error) {
        console.log(error);
        next({ st: 500, ms: error.message })
    }
};

const putProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, type, price, is_active, image, size, color } = req.body;
        const product = await Product.findById(id);
        if (!product) next({ st: 400, ms: "Product not found" })

        if (name) product.name = name;
        if (type) product.type = type;
        if (price) product.price = price;
        if (is_active !== undefined) product.is_active = is_active;
        if (image) product.image = image;
        if (size) product.size = size;
        if (color) product.color = color;

        await product.save();

        res.status(200).json({ data: { message: "Product updated successfully" } })
    } catch (error) {
        console.log(error);
        next({ st: 500, ms: error.message })
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await Product.deleteOne({ _id: id })
        if (!result) {
            return next({ st: 400, ms: "Product not found" })
        } else {
            res.status(200).json({ data: { message: "Product deleted successfully" } })
        }
    } catch (error) {
        console.log(error);
        next({ st: 500, ms: error.message })
    }
};

module.exports = {
    addProduct, getAllProducts, getProduct, putProduct, deleteProduct
}