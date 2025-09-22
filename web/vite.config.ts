import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import reactSwc from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const enableSwc = process.env.VITE_USE_SWC === 'true' || mode === 'swc'

  return {
    plugins: [enableSwc ? reactSwc() : react()],
  }
})
