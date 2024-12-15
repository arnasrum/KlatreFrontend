import './App.css'
// @deno-types="@types/react"
import {useCookies} from "react-cookie";
import Login from "./pages/Login";



function App() {
    const [cookie, setCookie, removeCookie] = useCookies(["g_state"], {doNotParse: true});
    return (
        <>
            <h1>You are logged in</h1>
            <Login/>
        </>
    )
}

export default App
