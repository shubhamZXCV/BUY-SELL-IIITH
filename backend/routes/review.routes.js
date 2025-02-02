import {Router} from 'express';
import Review from '../models/review.model.js';
import jwt from 'jsonwebtoken'
const router  = Router();

router.post('/add', async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const senderEmail = decoded.email;
      const { receiverEmail, message } = req.body;
  
      if (!message || !receiverEmail) {
        return res.status(400).json({ error: "Message and receiverEmail are required." });
      }
  
      let review = await Review.findOne({ senderEmail, receiverEmail });
  
      if (review) {
        review.message.push(message);
        await review.save();
      } else {
        review = new Review({ senderEmail, receiverEmail, message: [message] });
        await review.save();
      }
  
      res.status(200).json({ success: true, review });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


  router.get('/get', async (req, res) => {
    const { receiverEmail } = req.query;
  
    if (!receiverEmail) {
      return res.status(400).json({ error: 'receiverEmail query parameter is required' });
    }
  
    try {
      const reviews = await Review.find({ receiverEmail });
  
      // Check if any reviews found
      if (reviews.length === 0) {
        return res.status(404).json({ message: 'No messages found for the provided receiverEmail' });
      }
  
      // Grouping messages by senderEmail
      const groupedMessages = reviews.reduce((acc, review) => {
        const { senderEmail, message } = review;
  
        // If senderEmail is already in the accumulator, push the message array to the messages array
        if (acc[senderEmail]) {
          acc[senderEmail] = acc[senderEmail].concat(message); // Append new messages
        } else {
          acc[senderEmail] = message; // If it's the first message from this sender, store the array
        }
  
        return acc;
      }, {});
  
      // Convert the grouped object into an array of { senderEmail, messages }
      const messagesArray = Object.keys(groupedMessages).map(senderEmail => ({
        senderEmail,
        messages: groupedMessages[senderEmail],
      }));
  
      return res.status(200).json(messagesArray);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });


export default router;