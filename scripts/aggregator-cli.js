#!/usr/bin/env node
/**
 * @module utils/fs/cli
 */

import {Aggregator} from '../utils/fs/aggregator.js';

const args = process.argv.slice(2);
// Implement CLI argument parsing
const config = {
    includePaths: [], // from args
    // other config from args
};

const aggregator = new Aggregator(config);
const result = await aggregator.aggregate();
console.log(result);