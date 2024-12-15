import { useGoogleLogin, GoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import {useCookies} from "react-cookie";

function Login(): JSX.Element {

    interface GoogleResponse {
        credential: string
    }

    const [loggedIn, setLoggedIn] = useState(false)
    const [user, setUser] = useState({})
    const googleLogin = useGoogleLogin({
        flow: "auth-code",
        onSuccess: codeResponse => userLogin(codeResponse),
    })



    function parseGoogleJWT (token: string): object {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }

    interface GoogleCodeResponse {
        code: string
    }

    const userLogin = (googleCodeResponse: GoogleCodeResponse) => {
        console.log("googleResponse: ", googleCodeResponse)
        const response = fetch("http://localhost:8080/google_login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code: googleCodeResponse.code }),
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error(error, "it seems that the login failed"))
    }


    const handleGoogleResponse = (response: GoogleResponse)  => {
        console.log(response)
        //const token: JWTToken = parseGoogleJWT(response.credential)
    }
    const errorMessage = () =>  {
        console.error("Google login failed");
    }
    //<GoogleLogin onSuccess={handleGoogleResponse} onError={errorMessage} />
    return(
         <>
             <h1>Please Login</h1>
             {!loggedIn? (
                 <button onClick={() => googleLogin()}>Login</button>
             ) : (
                 <button>Logout</button>
             )}
         </>
    );
}

export default Login