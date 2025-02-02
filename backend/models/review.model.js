import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  senderEmail: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  },
  receiverEmail: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  },
  message: {
    type: [String],
    required: true,
    validate: {
      validator: function (arr) {
        return arr.length > 0;
      },
      message: "Message array cannot be empty."
    }
  }
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
