import { ErrorHandler } from "../utils/errorHandler.js";

export const errorMiddleware=(err,req,res,next)=>{
    err.message=err.message || "Internal Server Error";
    err.statusCode=err.statusCode|| 500;
   
    if(err.name==="CastError")
    {
        const message=`Resourse not found.Invalid: ${err.path}`;
        err=new ErrorHandler(message,404);
    }
    
    //mongoose duplicate key error
    if(err.code===11000)
    {
        const message=`Duplicate ${Object.keys(err.keyValue)}`;
        err=new ErrorHandler(message,400);
    }
    

    // JWT error
    if(err.name==="JsonWebTokenError")
    {
        const message=`Jason Web Token invalid`;
        err=new ErrorHandler(message,400);
    }

    if(err.name==="TokenExpiredError")
    {
        const message=`Jason Web Token expired`;
        err=new ErrorHandler(message,400);
    }



    res.status(err.statusCode).json({
        success:false,
        message:err.message,
        error:err.stack
    })
} 