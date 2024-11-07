import { defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.

  if (mode == 'development') {
    const env = loadEnv(mode, './..');
    return {
      // vite config
      plugins: [
        react(),
      ],
      server: {
        port: parseInt(env.VITE_FRONTEND_PORT),
        host: env.VITE_EXPOSE_FE_TO_NETWORK_DEV === 'TRUE' ? '0.0.0.0' : 'localhost',
      },
      envDir: './..',
    };
  }
  if (mode == 'production') {
    return {
      // vite config
      plugins: [react()],
      envDir: '.',
    };
  }
});