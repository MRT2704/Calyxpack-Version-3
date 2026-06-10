import DOMPurify from 'dompurify';

/**
 * Sanitize a string to prevent XSS or HTML injection.
 * Uses DOMPurify which cleans according to the browser's built‑in
 * sanitisation rules. Returns a safe string that can be stored or
 * displayed without risking script execution.
 */
export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input);
}
