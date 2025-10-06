import {useState, useEffect} from "react";
import User from "../interfaces/User.ts";
import {UserContext} from "./UserContext.ts";
import {apiUrl, origin} from "../constants/global"


function UserContextProvider({children}: { children: React.ReactNode}) {

    const [user, setUser] = useState<User>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        fetchUser();
    }, [])


    function setUserHandler(user: User) {
        setUser(user);
        setIsLoggedIn(true);
    }

    function fetchUser() {
        fetch(`${apiUrl}/api/oauth2/login`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then( async response => {
                console.log("response", response)
                if (response.ok) {
                    const userData = await response.json();
                    setUserHandler(userData.user);
                } else {
                    setIsLoggedIn(false);
                    setUser(null);
                }
            })
            .catch((error) => {
                console.error('Error fetching user:', error);
                setIsLoggedIn(false);
                setUser(null);
            })
    }

    function login() {
        window.location.href = `${apiUrl}/api/oauth2/authorization/google?origin=${origin}`;
    }

    function logout() {
        setIsLoggedIn(false);
        setUser(null);
        console.log("logout")
    }


    const contextValue = {
        user,
        "setUser": setUserHandler,
        isLoggedIn,
        login,
        logout,
        fetchUser
    }


    return(
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>

    )
}

export default UserContextProvider;