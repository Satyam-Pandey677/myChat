"use client"
import ChatSidebar from '@/components/ChatSidebar';
import Loading from '@/components/Loading';
import { useAppData, User } from '@/context/AppContext'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'


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

  const handleLogout = () => {

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

      />
    </div>
  )
}

export default ChatApp