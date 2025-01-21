import {defineConfig} from 'vite';
import * as path from 'path';

export default defineConfig({
    build: {
        lib: {
            entry: [
                path.resolve(__dirname, 'src/index.js'),
                path.resolve(__dirname, 'src/cli.js')
            ],
            formats: ['es'],
        },
        rollupOptions: {
            external: ['commander', 'glob', 'fs', 'path'],
        },
        outDir: 'dist',
        emptyOutDir: true,
        target: 'node18'
    }
});