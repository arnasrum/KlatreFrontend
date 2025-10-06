import './index.css'
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import { Provider } from "./components/ui/provider.tsx";
import {ChakraProvider} from "@chakra-ui/react";
import { system } from "./ChakraUIThemeConfig.ts"

createRoot(document.getElementById('root') as HTMLElement).render(
    <Provider>
        <StrictMode>
            <ChakraProvider value={system}>
                <App/>
            </ChakraProvider>
        </StrictMode>
    </Provider>
)
