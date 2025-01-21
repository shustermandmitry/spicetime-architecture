#!/usr/bin/env node

import {glob} from 'glob';
import {exec} from 'child_process';
import {promisify} from 'util';
import {dirname} from 'path';

const execAsync = promisify(exec);

async function generateDocs() {
    try {
        // Find all jsdoc.json files, excluding node_modules
        const configs = await glob('**/jsdoc.json', {
            ignore: ['**/node_modules/**', '**/dist/**']
        });

        for (const config of configs) {
            const dir = dirname(config);
            console.log(`\nGenerating docs for ${dir}`);
            try {
                const {stdout, stderr} = await execAsync(`cd ${dir} && jsdoc -c jsdoc.json`);
                if (stdout) console.log(stdout);
                if (stderr) console.error(stderr);
            } catch (err) {
                console.error(`Error generating docs for ${dir}:`, err.message);
            }
        }
    } catch (err) {
        console.error('Error finding jsdoc configs:', err);
        process.exit(1);
    }
}

generateDocs();