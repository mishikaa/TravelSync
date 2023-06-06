export const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0]
}

// m is the current message and i is the index of the current message, userId is the id of the logged in user
export const isSameSender = (messages, m, i, userId) => {
    return (
        i < messages.length - 1 && 
        (
            messages[i+1].sender._id !== m.sender._id //if the next message sent does not have the same sender as the current one 
            || messages[i+1].sender._id === undefined) 
            && messages[i].sender._id !== userId //we need to display the user profile picture only 
        );
}

export const isLastMessage = (messages, i, userId) => {
    return (
        i === (messages.length - 1) &&
        messages[messages.length - 1].sender._id !== userId &&
        messages[messages.length - 1].sender._id
    )
}

export const isSameSenderMargin = (messages, m, i, userId) => {
  
    // When the message is not the last one and sender is not the logged in user 
    if (
      i < messages.length - 1 &&
      messages[i + 1].sender._id === m.sender._id &&
      messages[i].sender._id !== userId
    )
      return 45;
    
    // When it's the last message sent by the sender
    else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

// Checking if the previous message has the same user as the current one
export const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i-1].sender._id === m.sender._id;
}