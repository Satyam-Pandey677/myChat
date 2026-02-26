"use client"

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client"
import { CHAT_SERVICE, useAppData } from "./AppContext";
import { CornerDownLeft } from "lucide-react";


interface SocketContextType{
    socket:Socket | null;
    onlineUsers: string[]
}

const SocketContext= createContext<SocketContextType|null>(null);

interface ProviderProps{
    children:ReactNode
}

export const SocketProvider = ({children}:ProviderProps)=>{
    const [socket, setSocket] = useState<Socket|null>(null);
    const [onlineUsers, setonlineUsers] = useState<string[]>([])
    const {user} = useAppData();

    useEffect(() => {
        if(!user?._id) return;

        const newSocket = io(CHAT_SERVICE,{
            query:{
                userId:user._id
            }
        });


        setSocket(newSocket)

        newSocket.on("getOnlineUser",(users:string[]) => {
            setonlineUsers(users);
        })

        return () => {
            newSocket.disconnect()
        }
    },[user?._id]);

    
    return (
        <SocketContext.Provider value={{socket,onlineUsers}}>
            {children}
        </SocketContext.Provider>
    )
}

export const SocketData = ():SocketContextType => {
    const context = useContext(SocketContext);
    if(!context){
        throw new Error("SocketData must be used within SocketProvider")
    }  
    return context;
}
    