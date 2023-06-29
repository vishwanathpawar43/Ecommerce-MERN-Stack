import { Order } from "../models/orderModel.js";
import {catchAsyncError} from '../middlerware/catchAsyncErrors.js'
import { ErrorHandler } from "../utils/errorHandler.js";
import {productModel as Product}  from "../models/productModel.js"

export const createOrder = catchAsyncError(async(req,res,next)=>{

   const {shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice}=req.body;

   const order= await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt:Date.now(),
    user:req.user._id
   })

   res.status(200).json({
    success:true,
    order
   });
})

export const getSingleOrder = catchAsyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id).populate(
        "user",
        "name email"
    )

    if(!order)
    {
        return next(new ErrorHandler("order not found",404));
    }

    res.status(200).json({
        success:true,
        order
    });
});

export const getMyOrders = catchAsyncError(async(req,res,next)=>{
    const orders=await Order.find({user:req.user._id});

    res.status(200).json({
        success:true,
        orders
    });
});

// admin routes

export const getAllOrders = catchAsyncError(async(req,res,next)=>{
    const orders=await Order.find();

    let totalAmount=0;

    orders.forEach(order=>{
        totalAmount+=order.totalPrice;
    })

    res.status(200).json({
        success:true,
        totalAmount,
        orders
    });
});

export const updateOrder = catchAsyncError(async(req,res,next)=>{
    const order =await Order.findById(req.params.id);

    if(!order)
    {
        return next(new ErrorHandler("order not found",404));
    }

    if(order.orderStatus==="Delivered")
    {
        return next(new ErrorHandler("Order already Delivered",400));
    }

    order.orderStatus=req.body.status;

    if(req.body.status==='Shipped')
    {
        order.orderItems.forEach(async (ord)=>{
            await updateStock(ord.product,ord.quantity);
        })
    }

    if(req.body.status==='Delivered')
    {
        order.deliveredAt=Date.now();
    }
    
    await order.save({validateBeforeSave:false});

    res.status(200).json({
        success:true,
        order
    });
});

async function updateStock (id,quantity)
{
    const product=await Product.findById(id);

    product.stock-=quantity;

    await product.save({validateBeforeSave:false});
}

export const deleteOrder = catchAsyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id);

    if(!order)
    {
        return next(new ErrorHandler("order not found",404));
    }

    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success:true,
        message:"Order deleted"
    });
});