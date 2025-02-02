import {Router} from 'express'
import xml2js from 'xml2js'
const router = Router();
import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'

router.get('/auth/cas/callback', async (req, res) => {
    const { ticket } = req.query;
  
    if (!ticket) {
      return res.status(400).json({ error: 'No ticket provided' });
    }
  
    try {
      // Validate CAS ticket
      const serviceUrl = encodeURIComponent('http://localhost:3000/signup');
      const casValidateUrl = `https://login.iiit.ac.in/cas/serviceValidate?ticket=${ticket}&service=${serviceUrl}`;
  
      const casResponse = await fetch(casValidateUrl);
      if (!casResponse.ok) {
        throw new Error(`CAS server returned status: ${casResponse.status}`);
      }
  
      // Parse XML response
      const casResponseText = await casResponse.text();
      const parser = new xml2js.Parser({ explicitArray: false });
      const result = await parser.parseStringPromise(casResponseText);
  
      // Extract email from CAS response
      const casUser = result['cas:serviceResponse']['cas:authenticationSuccess'];
      if (!casUser) {
        return res.status(401).json({ error: 'CAS authentication failed' });
      }
  
      const email = casUser['cas:user'];
      if (!email) {
        return res.status(401).json({ error: 'No email found in CAS response' });
      }
      console.log(email);
  
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(200).json({ success: false, email: email });
      }
  
      // Generate JWT token (same as login route)
      const payload = {
        email: user.email
      };
  
      const token = jwt.sign(payload, process.env.JWT_SECRET);
      
      // Return token and email
      res.status(200).json({ 
        success: true, 
        data: token,
        email: email
      });
  
    } catch (err) {
      console.error('Error in CAS callback:', err);
      res.status(500).json({ 
        success: false, 
        message: 'Server Error', 
        error: err.message 
      });
    }
  });

export default router;