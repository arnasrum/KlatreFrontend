import {useCookies} from "react-cookie";
import {useEffect, useState} from "react"
import Home from "./pages/Home.tsx";
import Test from "./pages/Test.tsx";
import Group from "./pages/Group.tsx";
import "./App.css"
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import type User from "./interfaces/User.ts";
import {GroupProvider} from "./contexts/GroupContext.tsx";
import SessionContextProvider from "./contexts/SessionContext.tsx";
import UserContextProvider from "./contexts/UserContextProvider.tsx";

function App() {

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
        <UserContextProvider>
            <SessionContextProvider>
                <GroupProvider>
                    <RouterProvider router={router}>
                    </RouterProvider>
                </GroupProvider>
            </SessionContextProvider>
        </UserContextProvider>
    )
}

export default App