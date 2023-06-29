import { productModel as Product} from "../models/productModel.js";
import {ErrorHandler} from "../utils/errorHandler.js"
import { catchAsyncError } from "../middlerware/catchAsyncErrors.js";
import { ApiFeatures } from "../utils/apiFeatures.js";
import cloudinary from 'cloudinary'
// admin functions
export const createProduct= catchAsyncError(async (req,res)=>{

    let images=[];

    if(typeof(req.body.images)==="string")
    {
        images.push(req.body.images);
    }
    else
    {
        images=req.body.images;
    }

    const imageLinks=[];

    for(let i=0;i<images.length;i++)
    {
        const result=await cloudinary.v2.uploader.upload(images[i],{
            folder:"products"
        })

        imageLinks.push({
            public_id:result.public_id,
            url:result.secure_url
        })
    }

    req.body.images=imageLinks;

    req.body.user=req.user.id;

    const product = await Product.create(req.body);
    
    res.status(200).json({
        success:true,
        product
    });
})

export const updateProduct= catchAsyncError(async (req,res,next)=>{
    
    let product = await Product.findById(req.params.id);

    if(!product)
    {
        return next(new ErrorHandler("Product not found",404));
    }

    let images=[];

    if(typeof(req.body.images)==="string")
    {
        images.push(req.body.images);
    }
    else
    {
        images=req.body.images;
    }

    const imageLinks=[];

    if(images!==undefined)
    {
        for(let i =0;i<product.images.length;i++)
        {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }

        for(let i=0;i<images.length;i++)
        {
            const result=await cloudinary.v2.uploader.upload(images[i],{
                folder:"products"
            })

            imageLinks.push({
                public_id:result.public_id,
                url:result.secure_url
            })
        }
        req.body.images=imageLinks;
    }

    
    
    product = await Product.findByIdAndUpdate(req.params.id,req.body,
        {
            new : true,
            runValidators:true,
            useFindAndModify:false
        });
    
        res.status(200).json({
            success:true,
            product
        });
})

export const deleteProduct = catchAsyncError(async(req,res,next)=>{
    let product = await Product.findById(req.params.id);

    if(!product)
    {
        return next(new ErrorHandler("Product not found",404));
    }

    for(let i =0;i<product.images.length;i++)
    {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    await product.deleteOne({_id:req.params.id});

    res.status(200).json({
        success:true,
        message:"Product deleted"
    });
})


export const adminGetAllProducts = catchAsyncError(async(req,res,next)=>{
    
    const products = await Product.find();

    res.status(200).json({
        success:true,
        products,  
    });
})

// public functions

export const getAllProducts = catchAsyncError(async(req,res,next)=>{
    
    const resultsPerPage=8;
    const productsCount=await Product.countDocuments();

    const apiFeatures=new ApiFeatures(Product.find(),req.query).search().filter();
    
    let products=await apiFeatures.query;

    let filteredProductsCount=products.length;
    
    apiFeatures.pagination(resultsPerPage);
    
    products = await apiFeatures.query.clone();
    
    res.status(200).json({
        success:true,
          products,
          productsCount,
          resultsPerPage,
          filteredProductsCount
    });
})

export const getProductDetails = catchAsyncError(async (req,res,next)=>{
    let product = await Product.findById(req.params.id);

    if(!product)
    {
        return next(new ErrorHandler("Product not found",404));
    }

    res.status(200).json({
        success:true,
        product,
    });
})

export const createProductReview= catchAsyncError(async(req,res,next)=>{
    const {rating,comment,productId}=req.body;

    const review={
        user:req.user.id,
        name:req.user.name,
        rating:Number(rating),
        comment
    }

    const product=await Product.findById(productId);

    const isReviewed = product.reviews.find(
        (rev)=> rev.user.toString()=== req.user.id.toString()
    );

    if(isReviewed)
    {
        product.reviews.forEach((rev)=>{
            if(rev.user.toString()=== req.user.id.toString())
            {
                rev.rating=Number(rating);
                rev.comment=comment;
            }
        })
    }
    else
    {
        product.reviews.push(review);
    }

    product.numOfReviews=product.reviews.length;


    let avg=0;

    product.reviews.forEach(rev=>{
        avg+=rev.rating
    });


    product.ratings=avg/product.reviews.length;

    // console.log(avg,product.reviews.length,avg/product.reviews.length)
    // console.log(product.ratings);

    await product.save({validateBeforeSave:false});

    res.status(200).json({
        success:true,
        product
    });
});

export const getProductReviews = catchAsyncError(async(req,res,next)=>{
    const product=await Product.findById(req.query.productId)

    if(!product)
    {
        return next(new ErrorHandler("Product not found",404));
    }

    res.status(200).json({
        success:true,
        reviews:product.reviews
    });
}); 


/// how any user can delete any product ?
export const deleteProductReview = catchAsyncError(async(req,res,next)=>{
    const product=await Product.findById(req.query.productId)

    if(!product)
    {
        return next(new ErrorHandler("Product not found",404));
    }

    const reviews =  product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString());

 
    const numOfReviews=reviews.length;

    let avg=0;

    reviews.forEach(rev=>{
        avg+=rev.rating
    });

    let ratings=0;

    if(numOfReviews!==0)
    {
        ratings=avg/reviews.length;
    }
    

    await Product.findByIdAndUpdate(req.query.productId,{reviews,numOfReviews,ratings},
        {new:true,runValidators:true,useFindAndModify:false});

    res.status(200).json({
        success:true,
        reviews:reviews
    });
}); 