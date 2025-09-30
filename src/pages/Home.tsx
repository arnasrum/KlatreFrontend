import {useCookies} from "react-cookie";
import { useState, useEffect } from "react"
import Login from "./Login.tsx";
import Groups from "./Groups.tsx"
import { TokenContext } from "../Context.tsx";
import {useNavigate} from "react-router-dom"
import {Heading} from "@chakra-ui/react";

function Home() {
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
            <Heading size="2xl">Klatre</Heading>
            <TokenContext.Provider value={contextValue} >
                {user ? (
                    <div>
                        <Groups/>
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
