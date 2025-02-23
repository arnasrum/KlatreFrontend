import './App.css'
import {useCookies} from "react-cookie";
import { createContext, useState } from "react"
import Login from "./pages/Login";
import { TokenContext} from "./Context";
import SendAPIRequest from "./pages/SendAPIRequest";
import Boulders from "./pages/Boulders";
import ImageViewer from "./pages/ImageViewer";
import ImageTest from "./pages/ImageTest";


function App() {
    const [user, setUser] = useState<object>(null)
    const [page, setPage] = useState<string>("image")
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
                <h3>Testing</h3>
                {user && page == "image" ? (
                    <div>
                        <ImageTest/>
                    </div>

                ) : (
                    <></>
                )}
            </TokenContext.Provider>
        </>
    )
}

export default App
