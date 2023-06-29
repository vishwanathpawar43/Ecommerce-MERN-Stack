import mongoose from "mongoose";

export const connectDatabase =  ()=>{
    mongoose.connect(process.env.DB_URI,{useUnifiedTopology:true,useNewUrlParser:true})
.then((data)=>console.log(`MongoDB connected with server ${data.connection.host}`))
// .catch((err)=> console.log(err))

};