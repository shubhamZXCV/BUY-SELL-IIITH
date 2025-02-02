import { Router } from "express";
import Product from "../models/product.model.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
const router = Router();

router.post("/list", async (req, res) => {
  const product = req.body;
  const { token } = product;
  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }
  // Verify the token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded || !decoded.email) {
    return res.status(401).json({ error: "Invalid token" });
  }
  // Extract the user's email from the decoded token
  const email = decoded.email;

  product.sellerEmail = email;

  console.log(product);

  const newProduct = new Product(product);

  try {
    await newProduct.save();
    res
      .status(200)
      .json({ success: true, message: "Product listed successfully" });
  } catch (err) {
    console.log(`Error in create product : ${err.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});


router.get('/search', async (req, res) => {
  try {
    // Extract query parameters
    // console.log(req.query);
    const { searchTerm, filters } = req.query;

    // Create a dynamic filter object for MongoDB
    const query = {sold:false};

    // Add searchTerm to the query if provided
    if (searchTerm) {
      query.name = { $regex: searchTerm, $options: 'i' }; // Case-insensitive search
    }

    // Add filters to the query if provided
    if (filters) {
      const categoryArray = filters.split(','); // Convert comma-separated filters into an array
      query.category = { $in: categoryArray }; // Matches any category in the array
    }

    // Fetch products based on the dynamic query
    const products = await Product.find(query);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
});

router.get('/get', async (req, res) => {
  try {
    // Extract query parameters
    // console.log(req.query);
    const { productId } = req.query;
    const objectId = new mongoose.Types.ObjectId(productId)
    // console.log(objectId);
    const products = await Product.findById(objectId);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
});





export default router;
