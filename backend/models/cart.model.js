import mongoose  from "mongoose";

const cartSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true, // Ensures the email field is mandatory
    unique: true,   // Ensures email is unique for each cart
    trim: true,     // Removes extra spaces
    lowercase: true // Converts email to lowercase
  },
  products: {
    type: [mongoose.Schema.Types.ObjectId], // Array of ObjectIds referencing product IDs
    ref: 'Product', // Reference to the Product model (optional if you have a Product schema)
    default: []     // Default value is an empty array
  }
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
