import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name:{
            type : String,
            required : true
        },
        imageUrl:{
            type : String,
            required : true
        },
        category:{
            type:String,
            required:true
        },
        sellerEmail:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        sold:{
            type:Boolean,
            default:false
        }
        
        
    }
)

const Product = mongoose.model('Product',productSchema)
export default Product