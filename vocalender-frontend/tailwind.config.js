import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: {} },
  plugins: [],
}
