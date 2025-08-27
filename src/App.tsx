import './App.css'
import {useCookies} from "react-cookie";
import { useState, useEffect } from "react"
import Login from "./pages/Login.tsx";
import { TokenContext } from "./Context.tsx";
import Groups from "./pages/Groups.tsx";


function App() {
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const [user, setUser] = useState<object | null>(cookies.user || null)

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