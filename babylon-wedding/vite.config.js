import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/cloudinary-search': {
          target: 'https://api.cloudinary.com',
          changeOrigin: true,
          rewrite: () => `/v1_1/${env.VITE_CLOUDINARY_CLOUD_NAME}/resources/search?expression=tags%3Dduo&with_field=context&max_results=500`,
          headers: {
            Authorization: 'Basic ' + Buffer.from(`${env.VITE_CLOUDINARY_API_KEY}:${env.VITE_CLOUDINARY_API_SECRET}`).toString('base64')
          }
        }
      }
    }
  }
})
