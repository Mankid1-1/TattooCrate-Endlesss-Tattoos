
/**
 * Sanitizes user input for use in LLM prompts.
 * Prevents basic prompt injection by escaping special characters and limiting length.
 *
 * @param input The user input string.
 * @param maxLength Maximum allowed length (default 1000).
 * @returns Sanitized string.
 */
export const sanitizePromptInput = (input: string, maxLength: number = 1000): string => {
    if (!input) return "";

    // 1. Truncate to maximum length to prevent token exhaustion DoS
    let sanitized = input.slice(0, maxLength);

    // 2. Remove control characters (except common whitespace)
    // sanitized = sanitized.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');

    // 3. Escape double quotes to prevent breaking out of string context in JSON or pseudo-code
    sanitized = sanitized.replace(/"/g, '\\"');

    // 4. Escape template literal syntax to prevent potential interpolation issues if used in JS context
    sanitized = sanitized.replace(/\${/g, '\\${');

    // 5. Replace newlines with spaces to keep the prompt structure intact if it relies on line breaks
    // (This is optional but good for single-line subject inputs)
    sanitized = sanitized.replace(/\n/g, ' ');

    return sanitized;
};
