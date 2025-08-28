import './index.css'
// @deno-types="@types/react"
import {StrictMode} from 'react'
// @deno-types="@types/react-dom/client"
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import { GoogleOAuthProvider } from "@react-oauth/google"
import { CookiesProvider} from "react-cookie";
import { Provider } from "./components/ui/provider.tsx";

createRoot(document.getElementById('root') as HTMLElement).render(
    <GoogleOAuthProvider clientId={"733167968471-7runi5g0s0gahprbah0lj1460ua2jjv3.apps.googleusercontent.com"}>
        <CookiesProvider>
            <Provider>
                <StrictMode>
                    <App/>
                </StrictMode>
            </Provider>
        </CookiesProvider>
    </GoogleOAuthProvider>
)
