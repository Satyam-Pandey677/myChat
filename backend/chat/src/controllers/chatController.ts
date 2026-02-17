import axios from "axios";
import type { AuthenticatedRequest } from "../middleware/isAuth.js";
import { CHAT } from "../modals/chatModals.js";
import { MSG } from "../modals/messageModal.js";
import TryCatch from "../utils/TryCatch.js";

export const createNewChat = TryCatch(async(req: AuthenticatedRequest, res) => {
    const userId = req.user?._id;
    const {otherUserId} = req.body

    if(!otherUserId){
        res.status(400)
        .json({
            message:"Other user id is required"
        })

        return;
    }

    const existingChat = await CHAT.findOne({
        user:{$all:[userId,otherUserId] , $size:2},
    })

    if(existingChat){
        res.json({
            message:"Chat already existed",
            chatId : existingChat._id,
        });
        return;
    }

    const newChat = await CHAT.create({
        users:[userId, otherUserId],
    })

    res.status(201)
    .json({
        message:"New Chat Created",
        chatId:newChat._id
    })
})


export const getAllChats = TryCatch(async(req:AuthenticatedRequest, res) => {
    const userId = req.user?._id;   

    if(!userId){
        res.status(400).json({
            message:"UserID missing"
        })
        return;
    }


    const chats = await CHAT.find({users: userId}).sort({updatedAt: -1});

    const chatWithUserData = await Promise.all(
        chats.map(async(chat) => {
            const otherUserId = chat.users.find((id) => id != userId);

            const unSeenCount = await MSG.countDocuments({
                chatId:chat._id,
                sender:{$ne: userId},
                seen:false,
            })

            try {
                const authHeaders = req.headers.authorization;
                const {data} = await axios.get(
                    `${process.env.USER_SERVICE}/api/v1/user/${otherUserId}`,
                    {
                        ...(authHeaders && {
                            headers:{
                                Authorization:authHeaders
                            }
                        })
                    }
                );

                return {
                    user:data,
                    chat:{
                        ...chat.toObject(),
                        latestMessage: chat.latestMessage || null,
                        unSeenCount,
                    }
                };

            } catch (error) {
                console.log(error);
                return{
                     user: {_id:otherUserId, name:"Unknown User"},
                     chat:{
                        ...chat.toObject(),
                        latestMessage: chat.latestMessage || null,
                        unSeenCount,

                    }
                };
            }
        })
    )

    res.json({
        chats: chatWithUserData,
    })
}) 



export const sendmessage  =  TryCatch(async(req:AuthenticatedRequest,res) => {
    const senderId = req.user?._id;

    const {chatId, text} = req.body;
    const imageFile = req.file;

    if(!senderId){
        res.status(401).json({
            message:"unauthorized",
        });
        return;
    }
    if(!chatId){
        res.status(400).json({
            message:"chat id required",
        });
        return;
    }

    if(!text && !imageFile){
        res.status(400).json({
            message:"Either text or image is required"
        })
        return;
    }

    const chat = await CHAT.findById(chatId)

    if(!chat){
        res.status(404).json({
            message:"Chat Not Found"
        })
        return;
    }

    const userInChat = chat.users.some(
        (userId) =>userId.toString() === senderId.toString()
    );

    if(!userInChat){
        res.status(403).json({
            message:"You not a participant of this chat"
        })
        return;
    }

    const otherUserId = chat.users.find(
        (userId) => userId.toString() !==  senderId.toString()
    );

    if(!otherUserId){
        res.status(401).json({
            message:"No other user",
        });
        return;
    }

    //socket setuo

    let messageData:any ={
        chatId : chatId,
        sender : senderId,
        seen : false,
        seenAt: undefined, 
    };

    if(imageFile){
        messageData.image = {
            url:imageFile.path,
            publicId: imageFile.filename,
        };

        messageData.messageType = "image",
        messageData.text = text || "";
    }else{
        messageData.text = text ;
        messageData.messageType = "text";
    }

    const message = new MSG(messageData);
    const savedMessage = await message.save(); 
    
    const latestMessageText = imageFile? "📷 Image " : text;

    await CHAT.findByIdAndUpdate(chatId,{
        latestMessage:{
            text: latestMessageText,
            sender: senderId
        },
        updatedAt: new Date(),  
    },{new :true})

    //emit to socket

    res.status(201).json({
        message:savedMessage,
        sender:senderId
    })
})

