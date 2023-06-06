import React from 'react'
import AvatarIcon from '../miscellaneous/Avatar'
import { ChatState } from '../../Context_API/chatProvider'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../../config/chatLogic'
import './ScrollableChat.css'

const ScrollableChat = ({messages}) => {
    const {user} = ChatState();
    return (
        
    <ScrollableFeed className='message-box'>
        {messages && messages.map((message, index) => (
            
            <div key={message._id} className='message'>
                    {(isSameSender(messages, message, index, user._id)
                     || isLastMessage(messages, index, user._id)
                    ) && <AvatarIcon user={message.sender}/>}
                    <span 
                        className="messageContent" 
                        style={
                            {
                                backgroundColor: `${
                                message.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                                }`,
                                marginLeft: isSameSenderMargin(messages, message, index, user._id), 
                                marginTop: isSameUser(messages, message, index) ? 3 : 10 
                            }
                        }>

                        {message.content}
                    </span>
                </div>
        ))}
    </ScrollableFeed>
    )
}

export default ScrollableChat
