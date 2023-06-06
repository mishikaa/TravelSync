import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context_API/chatProvider'
import './SingleChat.css'
import { ChatHeader } from './ChatHeader'
import axios from 'axios'
import { errorPopup } from './popup'
import ScrollableChat from './Chat/ScrollableChat'

import io from  'socket.io-client'

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

export const SingleChat = () => {
    
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const[newMessage, setNewMessage] = useState("")
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)

    const {user, selectedChat, fetchAgain, setFetchAgain, notification, setNotification} = ChatState()
    
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on('connected', () => setSocketConnected(true))
        socket.on('typing', () => setIsTyping(true))
        socket.on('stop typing', () => setIsTyping(false))
    }, [])
    
    const fetchMessages = async() => {
        // if none of the chats is selectedChat, then do nothing
        if(!selectedChat) {
            return;
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const {data} = await axios.get(`/api/message/${selectedChat._id}`, config)        
            
            setLoading(false)
            setMessages(data)
            
            socket.emit('join chat', selectedChat._id);

        } catch (error) {
            setLoading(false)
            errorPopup("Failed to load the messages")
        }
    }

    useEffect(() => {
        fetchMessages();
        
        selectedChatCompare = selectedChat;
    }, [selectedChat]);
        
    const sendMessage = async(event) => {
        //  The message can be sent either by pressing enter or by clicking on the send button
        if((event.key==="Enter" || event.type==="click") && newMessage) {
            socket.emit('stop typing', selectedChat._id)
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    }
                }
                
                setNewMessage("")
                event.preventDefault()
                
                const {data} = await axios.post("/api/message", {
                    content: newMessage,
                    chatId: selectedChat._id
                }, config)
                
                // console.log(data)
                socket.emit('new message', data);
                setMessages([...messages, data])
            } catch (error) {
                errorPopup("Failed to send the message!")
            }
        }
    }
    
    useEffect(() => {
        socket.on("message received", (newMessageReceived) => {
            if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                // Send notification
                if(!notification.includes(newMessageReceived)) {
                    setNotification([newMessageReceived, ...notification])
                    setFetchAgain(!fetchAgain)
                }

            } else {
                setMessages([...messages, newMessageReceived]);
            }
        })})
    
    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        // Typing Indicator Logic
        if(!socketConnected)
            return;
        
        if(!typing) {
            setTyping(true)
            socket.emit('typing', selectedChat._id)
        }

        let lastTypingTime = new Date().getTime()
        var timerLength = 3000
        setTimeout(() => {
            var timeNow = new Date().getTime()
            var timeDiff = timeNow - lastTypingTime

            if(timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id)
                setTyping(false)
            }
        }, timerLength)
    }

    return (
        <div className="single-chat">
            { !selectedChat ? (
                <div className="chatbox-text"> Click on a user to start chatting </div>
                )
            : (
            <>
                <ChatHeader fetchMessages={fetchMessages}/>
    
                {/* All Messages */}
                <div className='chat-area'>
                    {loading ? (
                        <img src="../assets/spinner.gif" style={{width: "2.5rem", height: "2.5rem", position: "relative", top: "-50%", left: "50%"}} alt="spinner" />
                    ) : (
                        <>
                            <ScrollableChat messages={messages}/>
                        </>
                    )}
                    
                    <div className='message-bar'>
                        <form className="bar-contents" onKeyDown={sendMessage}>
                            <div>
                                {isTyping ? <div><img style={{width: "60px"}} src="../assets/typing.gif" alt="" /></div> : <></>}
                            </div>
                            <div className='input-message'>
                                <input 
                                    type="text"
                                    placeholder="Type a message"
                                    onChange={typingHandler}
                                    value={newMessage}
                                    />
                                <img onClick={sendMessage} className='send-icon' src="../assets/send.png" alt="send icon" />
                            </div>
                        </form>
                    </div>
                </div>
            </>
            )}
        </div>
  )
}