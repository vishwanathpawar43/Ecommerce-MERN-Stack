import mongoose from 'mongoose';


const orderSchema = new mongoose.Schema({
    shippingInfo:{
        address:{
            type:String,
            required:true,
        },
        city:{
            type:String,
            required:true,
        },
        state:{
            type:String,
            required:true,
        },
        country:{
            type:String,
            required:true,
        },
        pincode:{
            type:Number,
            required:true,
        },
        phoneNo:{
            type:Number,
            required:true,
        }
    },
    orderItems:[
        {
            name:{
                type:String,
                required:true,
            },
            price:{
                type:Number,
                required:true,
            },
            quantity:{
                type:Number,
                required:true
            },
            image:{
                type:String,
                required:true,
            },
            product:{
                type:mongoose.Schema.ObjectId,
                ref:"Product",
                required:true,
            }
        }
    ],
    paymentInfo:{
        id:{
            type:String,
            required:true
        },
        status:{
            type:String,
            required:true
        }
    },

    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    
    paidAt:{
        type:Date,
        required:true
    },

    itemsPrice:{
        type:Number,
        default:0
    },
    taxPrice:{
        type:Number,
        default:0
    },
    shippingPrice:{
        type:Number,
        default:0
    },
    totalPrice:{
        type:Number,
        default:0
    },
    orderStatus:{
        type:String,
        default:"Processing",
    },
    createdAt:{
        type:Date,
        default:Date.now
    },

    deliveredAt:Date,

})

export const Order=mongoose.model('Order',orderSchema);