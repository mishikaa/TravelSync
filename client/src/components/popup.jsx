import { toast } from 'react-toastify';

const errorPopup = (message) => {
    toast.error(message, {
      toastId: "error",      
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    })
}

const successPopup = (message) => {
    toast.success(message, {
      toastId: "error",      
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    })
}

export { errorPopup, successPopup };