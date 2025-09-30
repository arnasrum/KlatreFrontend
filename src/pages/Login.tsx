import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import React, { useEffect, useContext } from 'react';
import { TokenContext } from "../Context.tsx"
import {apiUrl} from "../constants/global.ts";
import {Button} from "@chakra-ui/react";

function Login(): React.Element {

    const { user, setUser, logout } = useContext(TokenContext)
    const googleLogin = useGoogleLogin({
        onSuccess: codeResponse => handleGoogleCodeResponse(codeResponse),
        onError: error => console.log("Login failed: ", error),
        flow: "auth-code"
    })
    
    const logOut = () => {
        googleLogout();
        logout(); // Use the logout function from context
    }

    interface CodeResponse {
        code: string
    }

    const handleGoogleCodeResponse = (codeResponse: CodeResponse) =>  {
        const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

        if (!GOOGLE_CLIENT_ID) {
            console.error("VITE_GOOGLE_CLIENT_ID is not defined");
            return;
        }

        fetch(`${apiUrl}/google_oauth_exchange`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                code: codeResponse.code
            })
        })
            .then(response => response.json())
            .then(data => {
                setUser(data)
                console.log(data)
                return data
            })
            .catch(error => console.log(error))
    }


    useEffect(() => {
        if(user) {
            fetch(`${apiUrl}/google_login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "token": user.access_token
                })
            })
                .then(responseBody => console.log(responseBody))
                .catch(error => console.error(error))
        }
    }, [ user ])

    return(
         <>
             {user ? (
                 <div>
                     <Button type="button" colorPalette="blue" onClick={logOut}>Logout</Button>
                 </div>
             ) : (
                 <Button type="button" colorPalette="blue" variant="solid" shadow="lg" onClick={() => googleLogin()}>Sign in with Google 🚀 </Button>
             )}
         </>
    );
}

export default Login