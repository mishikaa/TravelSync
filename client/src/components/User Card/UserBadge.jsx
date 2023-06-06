// for modal

const styles = {
    backgroundColor: "#6247aa",
    padding: "3px 5px",
    borderRadius: "3px",
    
    closeBadge: {
        width: "10px",
        padding: "3px",
        position: "relative",
        bottom: "3px",
        left: "6px",
        cursor: "pointer"
    }
}
export const UserBadge = ({user, handleFunction}) => {
  return (
    <div className="badge" style={styles} onClick={handleFunction}>
        <span>{user.username}</span>
        <img style={styles.closeBadge} src="../assets/close.png" alt="" />
    </div>
  )
}
