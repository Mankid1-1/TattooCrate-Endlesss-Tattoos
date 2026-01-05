
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
    sanitized = sanitized.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');

    // 3. Escape double quotes to prevent breaking out of string context in JSON or pseudo-code
    sanitized = sanitized.replace(/"/g, '\\"');

    // 4. Escape template literal syntax to prevent potential interpolation issues if used in JS context
    sanitized = sanitized.replace(/\${/g, '\\${');

    // 5. Replace newlines with spaces to keep the prompt structure intact if it relies on line breaks
    // (This is optional but good for single-line subject inputs)
    sanitized = sanitized.replace(/\n/g, ' ');

    return sanitized;
};

/**
 * Escapes unsafe characters for HTML to prevent XSS.
 * Useful when using APIs like dangerouslySetInnerHTML or window.open().
 *
 * @param unsafe The unsafe string.
 * @returns Escaped string.
 */
export const escapeHtml = (unsafe: string): string => {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * Validates if a string is a safe image URL (http, https, or data:image).
 * Prevents usage of javascript: URIs in img src.
 *
 * @param url The URL to validate
 * @returns True if valid
 */
export const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  const lower = url.toLowerCase().trim();

  // Allow data URIs
  if (lower.startsWith('data:image/')) return true;

  // Allow http/https
  if (lower.startsWith('http://') || lower.startsWith('https://')) return true;

  // Allow relative paths (e.g. /assets/...)
  if (lower.startsWith('/') && !lower.startsWith('//')) return true;

  return false;
};

/**
 * Safely logs an error to the console without exposing sensitive properties.
 * Strictly logs message, name, and stack if available, masking potential secrets.
 *
 * @param context A string describing the context of the error
 * @param error The error object
 */
export const logSafeError = (context: string, error: any) => {
    const safeError = {
        message: error?.message || "Unknown error",
        name: error?.name || "Error",
        // Do not include the full error object as it may contain config/headers with secrets
    };

    // Log with a clear prefix and only safe properties
    console.error(`[${context}] ${safeError.name}: ${safeError.message}`);
};
