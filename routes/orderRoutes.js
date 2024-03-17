const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Product = require('../models/product');

router.post('/', async (req, res) => {
    const { products } = req.body;
    
    try {
        // Validate each product ID and retrieve product details
        const productDetails = await Promise.all(products.map(async productId => {
            const product = await Product.findById(productId);
            if (!product) {
                throw new Error(`Product with ID ${productId} not found`);
            }
            return product;
        }));

        // Create the order with the retrieved product details
        const order = new Order({
            products: productDetails.map(product => product._id)
        });

        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().populate('products');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
