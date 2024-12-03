import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import tailwindcss from "tailwindcss"
import { nodePolyfills } from 'vite-plugin-node-polyfills';


dotenv.config({path:'../.env'});

// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    plugins: [
        react(), nodePolyfills()
    ],
    server: {
        port: 8080
    },
    css: {
        postcss: {
            plugins:[tailwindcss()]
        }
    }
})
