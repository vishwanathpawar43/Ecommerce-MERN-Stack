import { userModel as User } from "../models/userModel.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { catchAsyncError } from "./catchAsyncErrors.js";
import jwt from 'jsonwebtoken'

export const isAuthenticated=catchAsyncError(async(req,res,next)=>{
    const {token}=req.cookies;
    if(!token)
    {
        return next(new ErrorHandler("Please Sign in first",401));
    }

    const decodedData= jwt.verify(token,process.env.JWT_SECRET);

    req.user=await User.findById(decodedData.id);

    next();
})

export const authorizedRoles=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role))
        {
            next(new ErrorHandler(`Role ${req.user.role} is not allowed to access the document`,403))
        }

        next();
    }
}