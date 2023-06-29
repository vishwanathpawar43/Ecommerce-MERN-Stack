import {ErrorHandler} from "../utils/errorHandler.js"
import { catchAsyncError } from "../middlerware/catchAsyncErrors.js";
import {sendToken} from "../utils/jwtToken.js"
import { userModel as User} from "../models/userModel.js"
import {sendEmail} from "../utils/sendEmail.js"
import crypto from 'crypto'
import cloudinary from 'cloudinary';

export const userRegister=catchAsyncError(async(req,res,next)=>{

    // console.log(req.body.avatar);
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:"avatars",
        width:150,
        crop:"scale"
    }) 


    const {name,email,password}=req.body;
    // userModel

    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:myCloud.public_id,
            url:myCloud.secure_url
        }
    });

    sendToken(user,201,res);

    // const token= user.getJWTToken();

    // res.status(201).json({
    //     success:true,
    //     token,
    //     user
    // })
})

export const userLogin =catchAsyncError(async(req,res,next)=>{
    const {email,password}=req.body;

    if(!email || !password)
    {
        return next(new ErrorHandler("Please enter email and password",400));
    }

    const user = await User.findOne({email}).select("+password");

    if(!user)
    {
        return next(new ErrorHandler("No such user",401));
    }

    const valid = await user.comparePassword(password);

    if(!valid)
    {
        return next(new ErrorHandler("Please enter valid email or password",401));
    }

    sendToken(user,200,res);
});

export const userLogout=catchAsyncError(async(req,res,next)=>{


    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })

    res.status(200).json({
        success:true,
        message:"Logout successful"
    })
})

export const forgotPassword = catchAsyncError(async(req,res,next)=>{

    const user = await User.findOne({email:req.body.email});

    if(!user)
    {
        return next(new ErrorHandler("User not found",404));
    }

    const resetToken= await user.getResetPasswordToken();
    
    await user.save({validateBeforeSave:false});

    // const resetPasswordUrl=`${req.protocol}://${req.get(
    //     "host"
    //     )}/api/v1/password/reset/${resetToken}`;
    const resetPasswordUrl=`${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message=`Your reset password url is:- \n\n ${resetPasswordUrl} \n\n It will be valid upto 15 mins`;

    try {
        await sendEmail({
            email:user.email,
            subject:`Ecommerce Recovery Email`,
            message
        });
        
        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`
        });

    } catch (error) {
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;

        await user.save({validateBeforeSave:false});

        return next(new ErrorHandler(error.message,500));

    }

})

export const resetPassword = catchAsyncError(async(req,res,next)=>{

   const resetToken = crypto
   .createHash("sha256")
   .update(req.params.token)
   .digest("hex");

   const user = await User.findOne({
    resetPasswordToken:resetToken,
    resetPasswordExpire:{$gt:Date.now()}
});
    
    if(!user)
    {
        return next(new ErrorHandler("Token invalid or expired"),400);
    }    

    if(req.body.password!=req.body.confirmPassword)
    {
        return next(new ErrorHandler("Passwords don't match"),400);
    }

    console.log(user.password);

    user.password=req.body.password
    user.resetPasswordToken=undefined
    user.resetPasswordExpire=undefined


    await user.save();

    
    sendToken(user,200,res);

})

export const getUserDetails=catchAsyncError(async (req,res,next)=>{
    const user= await User.findById(req.user._id);
    
    res.status(200).json({
    success:true,
    user
   })

});

export const updatePassword=catchAsyncError(async (req,res,next)=>{
    const user= await User.findById(req.user._id);

    const valid = await user.comparePassword(req.body.oldPassword);

    if(!valid)
    {
        return next(new ErrorHandler("Invalid password",401));
    }
    
    if(req.body.newPassword!=req.body.confirmPassword)
    {
        return next(new ErrorHandler("Passwords don't match"),400);
    }

    user.password=req.body.newPassword;

    await user.save();

    sendToken(user,200,res);
});

export const updateProfile = catchAsyncError(async(req,res,next)=>{

    const newUser ={
        name:req.body.name,
        email:req.body.email
    }

    // console.log(req.body.avatar);

    // console.log(typeof(req.body.avatar));

    if(req.body.avatar!=="undefined")
    {
        // console.log("abc");
        const user=await User.findById(req.user.id);
        const imageId=user.avatar.public_id;
        
        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud=await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder:"avatars",
            width:150,
            crop:"scale"
        }) 
        newUser.avatar={
            public_id:myCloud.public_id,
            url:myCloud.secure_url
        }
    }

    const user = await User.findByIdAndUpdate(req.user._id,newUser,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true,
        message:"Profile updated"
    })
});

export const adminGetAllUsers =catchAsyncError(async(req,res,next)=>{
    const users=await User.find();
    
    res.status(200).json({
        success:true,
        users
    })

});

// get user details -- admin
export const adminGetUser =catchAsyncError(async(req,res,next)=>{

    const user= await User.findById(req.params.id);
    
    if(!user)
    {
        return next(new ErrorHandler("User doesn't exsists",400));
    }

    res.status(200).json({
    success:true,
    user
   })


});

export const adminUpdateUserProfile = catchAsyncError(async(req,res,next)=>{

    const newUser ={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id,newUser,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    if(!user)
    {
        return next(new ErrorHandler("User doesn't exsists",400));
    }

    res.status(200).json({
        success:true,
        message:"Profile updated"
    })
});

export const adminDeleteUser = catchAsyncError(async(req,res,next)=>{

    const user = await User.findById(req.params.id);

    if(!user)
    {
        return next(new ErrorHandler("User doesn't exsists",400));
    }

    const imageId=user.avatar.public_id;
        
    await cloudinary.v2.uploader.destroy(imageId);

    await User.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
        success:true,
        message:"Profile deleted"
    })
});