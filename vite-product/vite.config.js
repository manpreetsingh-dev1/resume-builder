import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(async () => {
  const [{ default: react }, { default: tailwindcss }] = await Promise.all([
    import('@vitejs/plugin-react'),
    import('@tailwindcss/vite'),
  ])

  return {
    plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      "/api": "http://localhost:5000"
    }
  }
};

})
