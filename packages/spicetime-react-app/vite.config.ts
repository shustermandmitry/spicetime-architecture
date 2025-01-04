   import { mergeConfig } from 'vite';
   import { defineConfig } from 'vite';
   import {  baseConfig } from '../../tools/vite-config/base'

   export default defineConfig(
     mergeConfig(baseConfig, {
       // Add any LOCAL custom configurations here

       build: {
         outDir: 'dist', // Optional: Customize the build output directory
         sourcemap: true,
       },
     })
   );