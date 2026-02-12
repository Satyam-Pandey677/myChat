import mongoose, { Document, Schema } from "mongoose";

export interface IChat extends Document{
    users: string[],
    latestMessage:{
        text:string,
        sender:string,
    };

    createAt: Date,
    updateAt:Date
}

const chatSchema: Schema<IChat> = new mongoose.Schema({
    users: [{
        type:String,
        required:true
    }],
    latestMessage:{
        text:String,
        sender:String,
    }
},{
    timestamps:true
}
);

export const CHAT = mongoose.model<IChat>("CHAT", chatSchema);