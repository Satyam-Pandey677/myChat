import { configDotenv } from "dotenv";
import mongoose from "mongoose";

export const dbConnect = async() => {

    try {
        const connect =await mongoose.connect(`${process.env.DB_URL}`, {
            dbName:"myChat"
        })

        if(connect){
            console.log("db connected successfully")
        }
    } catch (error) {
        
    }
}