import {describe, expect, test} from 'vitest';
import {createEvent} from './createEvent.js';

describe('Event Creation', () => {
    test('creates simple event', () => {
        const event = createEvent(
            'test action',
            'test target'
        );
        expect(event.message).toBe(
            'test action:\ntest target'
        );
    });

    test('includes error message', () => {
        const event = createEvent(
            'test action',
            'test target',
            'something went wrong'
        );
        expect(event.message).toBe(
            'test action:\ntest target\n  error: something went wrong'
        );
    });

    test('accepts string context as next action', () => {
        const event = createEvent(
            'test action',
            'test target',
            '',
            'next action happened'
        );
        expect(event.message).toBe(
            'test action:\ntest target\n  next action happened'
        );
    });

    test('formats object context', () => {
        const event = createEvent(
            'test action',
            'test target',
            '',
            {type: 'test', count: 42}
        );
        expect(event.message).toBe(
            'test action:\ntest target\n  type: test\n  count: 42'
        );
    });
});