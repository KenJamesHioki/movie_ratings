import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import tsconfigPaths from 'vite-tsconfig-paths';

// export default defineConfig({
//   plugins: [
//     react(),
//     tsconfigPaths(),
//   ],
//   esbuild: {
//     loader: 'tsx',
//     include: /src\/.*\.tsx?$/,
//     exclude: /node_modules/,
//     jsx: 'automatic'
//   }
// });

