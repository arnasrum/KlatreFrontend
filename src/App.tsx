import './App.css'
import {useCookies} from "react-cookie";
import { useState, useEffect } from "react"
import Login from "./pages/Login";
import { TokenContext } from "./Context";
import Boulders from "./pages/Boulders";
import Groups from "./pages/Groups";


function App() {
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const [user, setUser] = useState<object>(cookies.user || null)

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
        console.log(user)
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
                            <Groups/>
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