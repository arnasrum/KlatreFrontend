/// <reference types="vite/client" />

import {defineConfig, UserConfig} from "vite"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"

const config: UserConfig = defineConfig({
    plugins: [
        react(),
        tsconfigPaths()
    ],
})

export default config;