import React, { useEffect, useContext } from 'react';
import { UserContext } from "../contexts/UserContext"
import {apiUrl} from "../constants/global.ts";
import {Button} from "@chakra-ui/react";

function Login(): React.ReactNode {

    const { user, login, logout } = useContext(UserContext);

    return(
         <>
             {!user ? (
                 <div>
                     <Button type="button" colorPalette="blue" variant="solid" shadow="lg" onClick={login}>Sign in with Google 🚀 </Button>
                 </div>
             ) : (
                 <Button type="button" colorPalette="blue" onClick={logout}>Logout</Button>
             )}
         </>
    );
}

export default Login