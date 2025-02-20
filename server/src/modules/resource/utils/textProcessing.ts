/**
 * Processes text to a more natural form by:
 * - Converting to lowercase
 * - Removing extra spaces
 * - Normalizing accents
 * - Basic character normalization
 */
export function naturalizeText(text: string): string {
  return text
    .toLowerCase()
    // Normalize Unicode characters (convert accented chars to basic form)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Replace multiple spaces with single space
    .replace(/\s+/g, ' ')
    // Trim whitespace
    .trim();
}