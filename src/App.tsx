import './App.css'
import {useCookies} from "react-cookie";
import { createContext, useState } from "react"
import Login from "./pages/Login";
import { TokenContext} from "./Context";
import SendAPIRequest from "./pages/SendAPIRequest";
import Boulders from "./pages/Boulders";
import ImageViewer from "./pages/ImageViewer";


function App() {
    const [user, setUser] = useState<object>(null)
    return (
        <>
            <h1>Klatre</h1>
            <TokenContext.Provider value={{"user": user, "setUser": setUser}} >
                {user ? (
                        <div>
                            <Boulders/>
                            <ImageViewer/>
                        </div>
                    ) : (
                        <Login/>
                )}
            </TokenContext.Provider>
        </>
    )
}

export default App
