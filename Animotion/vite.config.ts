import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {"@": path.resolve(__dirname, "./src")},
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://animotion-hianime-api.vercel.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
