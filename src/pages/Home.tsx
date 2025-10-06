import {useCookies} from "react-cookie";
import { useState, useEffect, useContext } from "react"
import Login from "./Login.tsx";
import Groups from "./Groups.tsx"
import { UserContext } from "../contexts/UserContext.ts"
import {useNavigate} from "react-router-dom"
import {Heading} from "@chakra-ui/react"

function Home() {
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const { user } = useContext(UserContext)

    return (
        <>
        <Heading size="2xl">Klatre</Heading>
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
        </>
    )
}

export default Home
