import mongoose from "mongoose";
import { DB_URI } from "../config/env.js";

if(!DB_URI){
    console.error("Please set up mongodb environment variable");
}

const connectToDatabase = async ()=>{
    try {
        await mongoose.connect(DB_URI)
        console.log("Connected to database")
        
    } catch (error) {
        console.log("Connection to db failed", error)
        process.exit(1)
    }
}

export default connectToDatabase;