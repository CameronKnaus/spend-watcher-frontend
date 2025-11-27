import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import checker from 'vite-plugin-checker';

// https://vite.dev/config/
export default defineConfig(() => {

  return {
    plugins: [react(), tsconfigPaths(), checker({
      overlay: false,
      terminal: true,
      typescript: true,
      eslint: {
        lintCommand: 'eslint . --ext .js,.jsx,.ts,.tsx',
        useFlatConfig: true
      }
    })],
    files: ['**/*.ts', '**/*.tsx'],
    server: {
      port: 3000
    },
    resolve: {
      alias: {
        Components: path.resolve(__dirname, 'src/Components'),
        Constants: path.resolve(__dirname, 'src/Constants'),
        Content: path.resolve(__dirname, 'src/Content'),
        Hooks: path.resolve(__dirname, 'src/Hooks'),
        Pages: path.resolve(__dirname, 'src/Pages'),
        Type: path.resolve(__dirname, 'src/Types'),
        Utils: path.resolve(__dirname, 'src/Util'),
      }
    }
  }
})
