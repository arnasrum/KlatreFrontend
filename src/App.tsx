import './App.css'
import {useCookies} from "react-cookie";
import { createContext, useState, useEffect } from "react"
import Login from "./pages/Login";
import { TokenContext} from "./Context";
import SendAPIRequest from "./pages/SendAPIRequest";
import Boulders from "./pages/Boulders";
import ImageViewer from "./pages/ImageViewer";


function App() {
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const [user, setUser] = useState<object>(cookies.user || null)
    const [page, setPage] = useState<string>("image")

    useEffect(() => {
        if (user) {
            setCookie('user', user, { 
                path: '/', 
                maxAge: 3600,
                secure: false, // Set to true in production with HTTPS
                sameSite: 'lax'
            });
        } else {
            removeCookie('user', { path: '/' });
        }
    }, [user, setCookie, removeCookie]);

    const contextValue = {
        user,
        setUser,
        logout: () => {
            setUser(null);
            removeCookie('user', { path: '/' });
        }
    };

    return (
        <>
            <h1>Klatre</h1>
            <TokenContext.Provider value={contextValue} >
                {user ? (
                        <div>
                            <Boulders/>
                            <Login/>
                        </div>
                    ) : (
                        <Login/>
                )}
            </TokenContext.Provider>
        </>
    )
}

export default App