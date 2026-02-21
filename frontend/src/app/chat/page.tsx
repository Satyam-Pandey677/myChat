"use client"
import ChatSidebar from '@/components/ChatSidebar';
import Loading from '@/components/Loading';
import { CHAT_SERVICE, useAppData, User } from '@/context/AppContext'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import axios from 'axios';


export interface Message {
  _id:string;
  chatId:string;
  sender:string;
  text?:string;
  image:{
    url:string,
    publicId:string,
  };
  messageType:"text"| "image",
  seen:boolean;
  seenAt:string;
  createdAt:string;
}

const ChatApp = () => {
  const {loading, isAuth, logoutUser,chats, user:loggedInUser, users, fetchChats, setChats } = useAppData();

  const [selectedUser, setSelectedUser] = useState<string |null>(null);
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [user, setUser] = useState<User |null>(null);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeOut, setTypingTimeOut] = useState<NodeJS.Timeout | null>(null)


  const router = useRouter();

  useEffect(() => {
    if(!isAuth && !loading){
      router.push("/login");
    }
  },[isAuth, router, loading]);

  const handleLogout = () => logoutUser();

  const createChat = async(u:User) => {
    try {
      const token = Cookies.get("token");
      const {data} = await axios.post(`${CHAT_SERVICE}/api/v1/chat/new`, {userId: loggedInUser?._id,otherUserId:u._id   
      },{
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      setSelectedUser(data.chatId);
      setShowAllUsers(false);
      await fetchChats();
    } catch (error) {
        toast.error("Failed to start chat")
    }
  }
 

  if(loading) return <Loading/>
  return (
    <div className="min-h-screen flex bg-gray-900 text-white relative overflow-hidden">
      <ChatSidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen ={setSidebarOpen}
        setShowAllUsers ={setShowAllUsers}
        showAllUsers ={showAllUsers}
        users ={users}
        loggedInUser ={loggedInUser}
        chats ={chats}
        selectedUser ={selectedUser}
        handleLogout = {handleLogout}
        setSelectedUser = {setSelectedUser}
        createChat = {createChat}
      />

      <div className='flex-1 flex flex-col justify-between p-4 backdrop-blur-xl bg-white/5 border border-white/10   '>

      </div>
    </div>
  )
}

export default ChatApp