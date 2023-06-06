import {createRoot} from "react-dom/client";
import {BrowserRouter} from 'react-router-dom';
import App from "./App";
import ChatProvider from "./Context_API/chatProvider";

const root = createRoot(document.querySelector('#root'))
root.render(
    <BrowserRouter>
        <ChatProvider>
            <App />
        </ChatProvider>
    </BrowserRouter>
);