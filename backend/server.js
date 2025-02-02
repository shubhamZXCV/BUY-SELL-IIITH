import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { connectDB } from './config/db.js';
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js'
import orderRoutes from './routes/order.routes.js'
import casRoutes from './routes/cas.route.js'
dotenv.config(); 
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/product",productRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/order",orderRoutes);
app.use("/api/cas",casRoutes);

app.post("/verify-captcha", async (req, res) => {
    const { token } = req.body;
  
    try {
      // Verify reCAPTCHA using Fetch API
      const response = await fetch(
        `https://www.google.com/recaptcha/api/siteverify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            secret: "6LdV2sMqAAAAACLPtfk8wBYMNSLDvfLgy0lr45S9", // Replace with your actual secret key
            response: token,
          }).toString(),
        }
      );
  
      const data = await response.json();
  
      if (data.success) {
        return res.status(200).json({ message: "CAPTCHA verified",success:true });
      } else {
        return res.status(400).json({ message: "CAPTCHA verification failed",success:false });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error",success:false });
    }
  });
  
  



app.listen(5000,async ()=>{
    await connectDB();
    console.log("Server started at http://localhost:5000");
})

app.get("/",(req,res)=>{
    res.send("server is ready")
})

//