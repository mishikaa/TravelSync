import './App.css'
import {Route, Routes} from "react-router-dom";
import ChatPage from "./pages/chatpage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import AuthPage from './pages/authpage';
import { HomePage } from './pages/homepage';

const App = () => {
    return (
        <div className="App">
            <ToastContainer />  
            <Routes>
                <Route exact path='/auth' element={ <AuthPage />} />
                <Route exact path='/' element={ <HomePage />} />
                <Route exact path='/chats' element={ <ChatPage />}/>
            </Routes>
        </div>
    )
}

export default App;