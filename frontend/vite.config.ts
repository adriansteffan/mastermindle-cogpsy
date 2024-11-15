import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, mode === 'development' ? './..' : '.');

  // Base config that's common to all modes
  const baseConfig = {
    plugins: [react()],
    envDir: mode === 'development' ? './..' : '.',
  };

  switch (mode) {
    case 'development':
      return {
        ...baseConfig,
        server: {
          port: parseInt(env.VITE_FRONTEND_PORT),
          host: env.VITE_EXPOSE_FE_TO_NETWORK_DEV === 'TRUE' ? '0.0.0.0' : 'localhost',
        },
      };
    
    case 'production':
      return baseConfig;
    
    // This is important - handle test mode and any other modes
    default:
      return baseConfig;
  }
});