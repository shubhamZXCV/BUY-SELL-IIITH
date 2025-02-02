import { Router } from "express";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
const router = Router();

router.post("/place", async (req, res) => {
  try {
    const { buyerEmail, sellers } = req.body;

    if (!buyerEmail || !sellers || !Array.isArray(sellers)) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    // Loop through sellers to create orders for each product
    const orders = [];
    const responseData = []; // Initialize responseData here to store all OTP and product info

    for (const seller of sellers) {
      const { sellerEmail, productIds } = seller;

      if (!sellerEmail || !Array.isArray(productIds)) {
        return res.status(400).json({ error: "Invalid seller data" });
      }

      // Loop through productIds to generate OTP and create orders
      for (const productId of productIds) {
        // Generate a random OTP and hash it
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
        const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

        // Create a new object for each productId to avoid overwriting
        const otpId = {
          productId: productId,
          otp: otp, // Store unhashed OTP in response
        };

        responseData.push(otpId);

        // Create an order object
        const order = new Order({
          buyerEmail,
          sellerEmail,
          productId,
          status: "pending",
          otpHash, // Store the hashed OTP in the database
        });

        // Add the created order to the orders array
        orders.push(order);
      }
    }

    // Save all orders to the database
    await Order.insertMany(orders);

    return res.status(201).json({
      message: "Orders placed successfully",
      orders: responseData, // Send the productId and unhashed OTP in the response
    });
  } catch (error) {
    console.error("Error placing orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/getBuy", async (req, res) => {
  try {
    // Extract token from headers
    const token = req.headers.authorization?.split(" ")[1]; // Assuming Bearer token
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is required" });
    }

    // Verify token and extract email
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your secret key
    const email = decoded.email;

    if (!email) {
      return res
        .status(400)
        .json({ message: "Invalid token: email not found" });
    }

    // Find orders with matching buyerEmail
    const orders = await Order.find({ buyerEmail: email });

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    // Extract product IDs from orders
    const productIds = orders.map((order) => order.productId);
    console.log(productIds);

    // Find product details for the extracted product IDs
    const products = await Product.find({ _id: { $in: productIds } });
    console.log(products);
    // Combine products with their corresponding order status
    const response = products.map((product) => {
      const order = orders.find(
        (order) => order.productId.toString() === product._id.toString()
      );
      return {
        ...product.toObject(), // Convert Mongoose document to plain object
        orderStatus: order?.status || "unknown", // Include order status
      };
    });

    console.log(response);

    // Send the response
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error in /getBuy:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/getSell", async (req, res) => {
  try {
    // Extract token from headers
    const token = req.headers.authorization?.split(" ")[1]; // Assuming Bearer token
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is required" });
    }

    // Verify token and extract email
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your secret key
    const email = decoded.email;

    if (!email) {
      return res
        .status(400)
        .json({ message: "Invalid token: email not found" });
    }

    // Find orders where sellerEmail matches and status is "done"
    const orders = await Order.find({ sellerEmail: email, status: "done" });

    if (!orders.length) {
      return res
        .status(404)
        .json({ message: "No sold products found for this user" });
    }

    // Extract product IDs from orders
    const productIds = orders.map((order) => order.productId);

    // Find product details for the extracted product IDs
    const products = await Product.find({ _id: { $in: productIds } });

    // Combine products with their corresponding order status and buyerEmail
    const response = products.map((product) => {
      const order = orders.find(
        (order) => order.productId.toString() === product._id.toString()
      );
      return {
        ...product.toObject(), // Convert Mongoose document to plain object
        orderStatus: order?.status || "unknown", // Include order status
        buyerEmail: order?.buyerEmail || "unknown", // Include buyer email
      };
    });

    // Send the response
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error in /getSell:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Middleware to authenticate and extract email from the JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access token missing" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.email = user.email; // Extract email from the token
    next();
  });
};

// Endpoint to get pending orders for the seller
router.get("/pending-orders", authenticateToken, async (req, res) => {
  try {
    const sellerEmail = req.email;

    // Find all pending orders where the seller email matches
    const pendingOrders = await Order.find({
      sellerEmail: sellerEmail,
      status: "pending",
    });

    if (!pendingOrders.length) {
      return res.status(404).json({ message: "No pending orders found" });
    }

    // Extract productIds and buyerEmails from pending orders
    const productIds = pendingOrders.map((order) => order.productId);
    const buyerEmails = pendingOrders.map((order) => ({
      productId: order.productId,
      buyerEmail: order.buyerEmail,
    }));

    // Fetch product details for the extracted productIds
    const products = await Product.find({ _id: { $in: productIds } });

    // Combine product details with buyer emails
    const response = products.map((product) => {
      const buyerInfo = buyerEmails.find(
        (info) => info.productId.toString() === product._id.toString()
      );
      return {
        ...product.toObject(),
        buyerEmail: buyerInfo ? buyerInfo.buyerEmail : null,
      };
    });

    return res.status(200).json({ products: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/verify-otp", async (req, res) => {
  const { otp, buyerEmail, token, productId } = req.body;

  if (!otp || !buyerEmail || !token || !productId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Decode the JWT token to extract the seller's email
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const sellerEmail = decoded.email;

    // Find the order associated with the buyer, seller, and productId
    const order = await Order.findOne({
      buyerEmail,
      sellerEmail,
      productId,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Hash the OTP provided by the user and compare with stored OTP hash
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    if (otpHash !== order.otpHash) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // If OTP is valid, update the order status to 'done'
    order.status = "done";
    await order.save();

    // Update the sold field of the product to true
    await Product.findByIdAndUpdate(productId, { sold: true });

    res
      .status(200)
      .json({
        message: "OTP verified successfully, product marked as sold",
        order,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
