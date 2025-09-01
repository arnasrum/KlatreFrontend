import {useCookies} from "react-cookie";
import {useEffect, useState} from "react"
import {TokenContext} from "./Context.tsx";
import Home from "./pages/Home.tsx";
import Test from "./pages/Test.tsx";
import Group from "./pages/Group.tsx";
import "./App.css"
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import type User from "./interfaces/User.ts";
import {GroupProvider} from "./contexts/GroupContext.tsx";


function App() {
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const [user, setUser] = useState<User | null>(cookies.user || null)

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

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Home/>
        },
        {
            path: "groups/:groupUUID",
            element: <Group/>,
        },
        {
            path: "/test",
            element: <Test/>
        }
    ])

    return (
        <TokenContext.Provider value={contextValue}>
            <GroupProvider>
                <RouterProvider router={router}>
                </RouterProvider>
            </GroupProvider>
        </TokenContext.Provider>
    )
}

export default App