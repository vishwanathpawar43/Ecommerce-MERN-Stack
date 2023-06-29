import mongoose from "mongoose";

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter Product name"]
    },
    description:{
        type:String,
        required:[true,"Please enter Product description"]
    },
    price:{
        type:Number,
        required:[true,"Please enter Product price"]
    },
    ratings:{
        type:Number,
        default:0
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    images:[{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }],
    category:{
        type:String,
        required:[true,"Please enter Product category"]
    },
    stock:{
        type:Number,
        required:[true,"Please enter Product stock"],
        default:1
    },
    reviews:[{
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:true
        },
        name:{
            type:String,
            required:true
        },
        rating:{
            type:Number,
            required:true
        },
        comment:{
            type:String,
            required:true
        }
    }],

    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    
    createdAt:{
        type:Date,
        default:Date.now()
    }
});

export const productModel=mongoose.model("Product",productSchema);