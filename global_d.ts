// global.d.ts
import type {Vi} from 'vitest';

declare global {
    var vi: Vi; // Declare the global vi variable with the correct type
}

// Always include this to mark the file as a module (to avoid issues with global augmentation).
export {};