import express from 'express';
import { router as productRouter } from './routes/productRoutes.js';
import { router as userRouter } from './routes/userRoutes.js';
import { router as orderRouter} from './routes/orderRoutes.js';
import { router as paymentRouter} from './routes/paymentRoutes.js';

import { errorMiddleware } from './middlerware/error.js';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload'
import dotenv from 'dotenv'

export const app=express();


dotenv.config({path:"BackEnd/config/config.env"})


// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1",productRouter);
app.use("/api/v1",userRouter);
app.use("/api/v1",orderRouter);
app.use("/api/v1",paymentRouter);

app.use(errorMiddleware); 
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());