import mongoose from "mongoose";
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  buyerEmail: {
    type: String,
    required: true,
  },
  sellerEmail: {
    type: String,
    required: true,
  },
  productId:{
    type :mongoose.Schema.Types.ObjectId,
    required : true,
  },
  status :{
    type:String,
    enum:['pending','done']
  },
  otpHash :{
    type:String,
    required : true
  }
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
