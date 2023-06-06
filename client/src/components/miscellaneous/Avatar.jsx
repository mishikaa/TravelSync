import Avatar from 'react-avatar';

const styles={
    border: "1.75px solid #fff",
    padding: "1.25px"
}
const AvatarIcon = ({user, size}) => {
    return (
      <Avatar style={styles}
          name={user.username}
        
          src={user.profilePic === 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg' ? '' : user.profilePic} 
          size= {size ? size : 40}
          round="50px" 
          textSizeRatio={2}/>
    )
}

export default AvatarIcon
