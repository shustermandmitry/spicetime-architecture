/**
 * @module utils/events
 */

/**
 * Creates an event object for the messaging service
 * @param {string} action - What happened
 * @param {string} target - What it happened to
 * @param {string} [errorMessage] - Error details if any
 * @param {Object|string} [context] - Additional context or next action
 * @returns {Object} Event object with prototypal history chain
 */
export function createEvent(action, target, errorMessage = null, context = null) {
    const newEvent = Object.create(null);

    let message = `${action}:\n${target}`;

    if (errorMessage) {
        message += `\n  error: ${errorMessage}`;
    }

    if (typeof context === 'string') {
        message += `\n  ${context}`;
    } else if (context) {
        message += '\n  ' + Object.entries(context)
            .map(([k, v]) => `${k}: ${v}`)
            .join('\n  ');
    }

    newEvent.message = message;

    if (context) {
        Object.assign(newEvent, context);
    }

    return newEvent;
}