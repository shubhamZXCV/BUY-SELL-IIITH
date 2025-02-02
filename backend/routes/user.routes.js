
import User from '../models/user.model.js';
import { Router } from 'express';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
const router = Router();

router.post("/register",async (req , res)=>{
    const user = req.body;
    const salt = await bcrypt.genSalt(10);
    let securePass = user.password;

    securePass = await  bcrypt.hash(securePass,salt);
    user.password = securePass
    // console.log(user)

    if(!user || !user.name  || !user.rollNo ||!user.age || !user.contactNumber  || !user.email){
        return res.status(400).json({success:false,message:"Please provide all fields"});
    }

    const data = {
       
        email:user.email
    }

    const token = jwt.sign(data,process.env.JWT_SECRET);



    const newUser = new User(user);

    try{
        await newUser.save();
        res.status(200).json({success:true, data:token,email:user.email});
    }catch(err){
        console.log(`Error in create user : ${err.message}`);
        res.status(500).json({success:false,message:"Server Error"});
    }
})

router.post("/login",async (req,res)=>{
   
    const {email , password} = req.body;
    if(!email || !password){
        return res.status(400).json({success:false,message:"Please enter valid credentials"});
    }

    try{
        const user  = await User.findOne({email:email});

        if(!user){
            return res.status(400).json({success:false,message:"Please enter valid credentials"});
        }

        const matched = await bcrypt.compare(password,user.password);

        if(!matched){
            return res.status(400).json({success:false,message:"Please enter valid credentials"});
        }

        const payload = {
            email:user.email
        }

       const token =  jwt.sign(payload , process.env.JWT_SECRET);
       res.status(200).json({success:true, data:token,email:email});


    }catch(err){
        console.log(`Error in locating user : ${err.message}`);
        res.status(500).json({success:false,message:"Server Error"});
    }
})
router.post("/edit", async (req, res) => {
    try {
      const { token, ...updateFields } = req.body;
      // console.log(token);
      // console.log(updateFields);
  
      if (!token) {
        return res.status(400).json({ error: 'Token is required' });
      }
  
      // Verify the token
      const decoded = jwt.verify(token,process.env.JWT_SECRET);
  
      if (!decoded || !decoded.email) {
        return res.status(401).json({ error: 'Invalid token' });
      }
  
      // Extract the user's email from the decoded token
      const email = decoded.email;
  
      // Find the user by email and update the fields
      const user = await User.findOneAndUpdate(
        { email }, // Find user by email
        { $set: updateFields }, // Update the fields
        { new: true } // Return the updated user document
      );
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Send success response
      res.status(200).json({ success: true, message: 'User updated'});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

router.post("/get",async (req,res)=>{
    // console.log(req.body);
    try {
        const { token } = req.body;
    
        if (!token) {
          return res.status(400).json({ error: 'Token is required' });
        }
    
        // Decode the token to get the email
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
       
        if (!decoded || !decoded.email) {
          return res.status(400).json({ error: 'Invalid token' });
        }
    
        const email = decoded.email;
    
        // Fetch the user details using the email
        const user = await User.findOne(
            { email: email },
            
          ); 
        user.password = "";
        // console.log(user);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        res.status(200).json({ user });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
})

export default router;