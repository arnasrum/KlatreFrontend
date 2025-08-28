import {useCookies} from "react-cookie";
import { useState, useEffect } from "react"
import Login from "./Login.tsx";
import Groups from "./Groups.tsx"
import { TokenContext } from "../Context.tsx";
import {useNavigate} from "react-router-dom"

function Home() {
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const [user, setUser] = useState<object | null>(cookies.user || null)
    const nav = useNavigate()

    function goToTest() {
        nav("/test")
    }

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
                        <button type="button" onClick={goToTest}>Test</button>
                        <Login/>
                    </div>
                ) : (
                    <div>
                        <Login/>
                    </div>
                )}
            </TokenContext.Provider>
        </>
    )
}

export default Home
