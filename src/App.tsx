import {useCookies} from "react-cookie";
import { useState, useEffect } from "react"
import Login from "./pages/Login.tsx";
import { TokenContext } from "./Context.tsx";
import Groups from "./pages/Groups.tsx";
import Home from "./pages/Home.tsx";
import Test from "./pages/Test.tsx";
import "./App.css"
import { BrowserRouter, Routes, Route } from 'react-router-dom'


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
        <TokenContext.Provider value={contextValue}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/test" element={<Test />} />

                </Routes>
            </BrowserRouter>
        </TokenContext.Provider>
    )
}

export default App