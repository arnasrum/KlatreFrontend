import './index.css'
// @deno-types="@types/react"
import {StrictMode} from 'react'
// @deno-types="@types/react-dom/client"
import {createRoot} from 'react-dom/client'
// @ts-ignore
import App from './App.tsx'
import { GoogleOAuthProvider } from "@react-oauth/google"

createRoot(document.getElementById('root') as HTMLElement).render(
    <GoogleOAuthProvider clientId={"733167968471-7runi5g0s0gahprbah0lj1460ua2jjv3.apps.googleusercontent.com"}>
        <StrictMode>
            <App/>
        </StrictMode>
    </GoogleOAuthProvider>
)
