import React from "react"
import ContentLoader from "react-content-loader"

const ChatLoading = () => (
  <ContentLoader style={{alignSelf: "center"}}
    speed={2}
    width={200}
    height={160}
    viewBox="0 0 200 160"
    backgroundColor="rgba(255, 255, 255, .3)"
    foregroundColor="#ecebeb"
  >
    <rect x="0" y="56" rx="3" ry="3" width="245" height="10" /> 
    <rect x="0" y="72" rx="3" ry="3" width="245" height="10" /> 
    <rect x="0" y="88" rx="3" ry="3" width="245" height="10" /> 
  </ContentLoader>
)

export default ChatLoading