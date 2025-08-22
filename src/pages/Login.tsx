import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import { useEffect, useContext } from 'react';
import { TokenContext } from "../Context.tsx"

function Login(): JSX.Element {

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

        fetch("http://localhost:8080/google_oauth_exchange", {
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
            fetch("http://localhost:8080/google_login", {
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
                     <p>Logged In</p>
                     <button type="button" onClick={logOut}>Logout</button>
                 </div>
             ) : (
                 <button type="button" onClick={() => googleLogin()}>Sign in with Google 🚀 </button>
             )}
         </>
    );
}

export default Login