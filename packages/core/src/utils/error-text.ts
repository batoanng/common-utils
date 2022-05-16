import { capitalize, last } from 'lodash';

export const DEFAULT_ERROR_TEXT = 'Oops, an unexpected error occurred';

function parseError(error: unknown): string {
    if (error) {
        if (typeof error === 'string') {
            return error;
        }
        if (typeof error === 'object') {
            // Handle standard errors: 'new Error(message)'
            // Also handle API error response bodies that include a message field
            if ('message' in error) {
                // @ts-ignore
                return error.message;
            }
        }
    }
    return DEFAULT_ERROR_TEXT;
}

// Format applies some basic formatting to error strings
// Capitalize the first letter
// Final full stop
function format(value: string): string {
    let result = capitalize(value);
    if (!['.', '!', '?'].includes(last(value) || '')) {
        result += '.';
    }
    return result;
}

/**
 * Parsing error to message
 * @param error
 */
export function errorText(error: unknown): string {
    return format(parseError(error));
}
