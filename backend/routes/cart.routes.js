import {Router} from 'express'
import Cart from "../models/cart.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Product from "../models/product.model.js"

const router = Router();

router.post('/add', async (req, res) => {
    const { token, productId } = req.body;

    const objectId = new mongoose.Types.ObjectId(productId)
  
    if (!token || !productId) {
      return res.status(400).json({ message: 'Token and productId are required' });
    }
  
    try {
      // Verify and decode the JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const email = decoded.email;
  
      if (!email) {
        return res.status(401).json({ message: 'Invalid token: Email not found' });
      }
  
      // Find the cart by email or create a new cart if not exists
      const cart = await Cart.findOneAndUpdate(
        { email }, // Filter by email
        { $addToSet: { products: objectId } }, // Add productId to products array (avoiding duplicates)
        { new: true, upsert: true } // Return updated document and create if not exists
      );
  
      res.status(200).json({ message: 'Product added to cart', cart });
    } catch (error) {
      console.error('Error adding product to cart:', error);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.get('/get', async (req, res) => {
    const token = req.query.token; // Extract the token from the query parameter
  
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }
  
    try {
      // Verify and decode the JWT
      const decoded = jwt.verify(token,process.env.JWT_SECRET);
      const email = decoded.email;
  
      if (!email) {
        return res.status(401).json({ message: 'Invalid token: Email not found' });
      }
  
      // Find the cart for the user by email
      const cart = await Cart.findOne({ email });
  
      if (!cart || !cart.products || cart.products.length === 0) {
        return res.status(404).json({ message: 'Cart is empty or not found' });
      }
  
      // Fetch product details from the Product collection
      const products = await Product.find({ _id: { $in: cart.products } });
  
      res.status(200).json({
        message: 'Cart details fetched successfully',
        products,
      });
    } catch (error) {
      console.error('Error fetching cart details:', error);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.delete('/remove', async (req, res) => {
    const { token, productId } = req.body;
  
    // Validate the inputs
    if (!token || !productId) {
      return res.status(400).json({ message: 'Token and productId are required' });
    }
  
    try {
      // Verify and decode the JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const email = decoded.email;
  
      if (!email) {
        return res.status(401).json({ message: 'Invalid token: Email not found' });
      }
  
      // Find the cart by email and remove the productId from the products array
      const cart = await Cart.findOneAndUpdate(
        { email }, // Filter by email
        { $pull: { products: productId } }, // Remove the productId from the array
        { new: true } // Return the updated document
      );
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found for the given email' });
      }
  
      res.status(200).json({ message: 'Product removed from cart', cart });
    } catch (error) {
      console.error('Error removing product from cart:', error);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.delete("/clear/:email", async (req, res) => {
    try {
      const { email } = req.params;
  
      // Check if the cart exists and delete it
      const cart = await Cart.findOneAndDelete({ email });
  
      if (!cart) {
        return res.status(404).json({ message: "Cart not found for the specified email" });
      }
  
      res.status(200).json({ message: "Cart deleted successfully", cart });
    } catch (error) {
      console.error("Error deleting cart:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  

export default router