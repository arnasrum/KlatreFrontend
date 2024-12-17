import { useGoogleLogin, GoogleLogin, googleLogout } from '@react-oauth/google';
import { useState, useEffect, useContext } from 'react';
import { TokenContext } from "../Context"

function Login(): JSX.Element {

    const { user, setUser } = useContext(TokenContext)
    const googleLogin = useGoogleLogin({
        // @ts-ignore
        onSuccess: codeResponse => handleGoogleCodeResponse(codeResponse),
        onError: error => console.log("Login failed: ", error),
        flow: "auth-code"
    })
    const logOut = () => {
        googleLogout()
    }

    interface CodeResponse {
        code: string
    }

    const handleGoogleCodeResponse = (codeResponse: CodeResponse) =>  {
        const GOOGLE_CLIENT_ID = "733167968471-7runi5g0s0gahprbah0lj1460ua2jjv3.apps.googleusercontent.com"
        const GOOGLE_CLIENT_SECRET = "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"
        const requestBody = {
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "grant_type": "authorization_code",
            "code": codeResponse.code,
            "redirect_uri": "postmessage"
        }
        fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${codeResponse.code}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        })
            .then(response => response.json())
            .then(data => setUser(data))
            .catch(error => console.log(error))
        return
    }


    useEffect(() => {
        if(user) {
            fetch("http://localhost:8080/google_login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "token": user.access_token
                })
            })
                .then(response => response.json())
                .then(responseBody => console.log(responseBody))
                .catch(error => console.error(error))
        }
    }, [ user ])

    return(
         <>
             {user ? (
                 <div>
                     Logged In
                 </div>
             ) : (
                 <button onClick={() => googleLogin()}>Sign in with Google 🚀 </button>
             )}
         </>
    );
}

export default Login