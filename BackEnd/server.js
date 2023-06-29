import {app} from "./app.js";
import dotenv from 'dotenv'
import { connectDatabase } from "./config/database.js";
import cloudinary from 'cloudinary';

process.on("uncaughtException",(err)=>{
    console.log(`Error is : ${err.message} `);
    console.log("Shutting down server due to UnCaught Exception");
    process.exit(1);

})

// env variables
dotenv.config({path:"BackEnd/config/config.env"})

//database
connectDatabase();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET

});


const server=app.listen(process.env.PORT,()=>{
    console.log(`Server working on Port http://localhost:${process.env.PORT}`);
})

process.on("unhandledRejection",(err)=>{
    console.log(`Error is : ${err.message} `);
    console.log("Shutting down server due to Unhandled Promise Rejection");

    server.close(()=>{
        process.exit(1);
    })
})