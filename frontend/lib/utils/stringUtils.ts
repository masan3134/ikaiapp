/**
 * String utility functions
 */

/**
 * Truncate text to max length and add ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

/**
 * Get initials from first and last name
 */
export function getInitials(firstName: string, lastName: string): string {
  const first = firstName?.trim() || "";
  const last = lastName?.trim() || "";

  if (!first && !last) return "??";
  if (!first) return last.substring(0, 2).toUpperCase();
  if (!last) return first.substring(0, 2).toUpperCase();

  return (first[0] + last[0]).toUpperCase();
}

/**
 * Convert text to URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

/**
 * Capitalize first letter of each word
 */
export function capitalizeWords(text: string): string {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Get full name from first and last name
 */
export function getFullName(firstName: string, lastName: string): string {
  return `${firstName || ""} ${lastName || ""}`.trim() || "İsimsiz";
}

/**
 * Fix encoding issues with Turkish characters in filenames
 * Handles both URI encoding and Latin-1 encoding issues
 */
export function fixFileNameEncoding(fileName: string): string {
  if (!fileName) return "";

  try {
    // Try to decode if it's already URI encoded
    const decoded = decodeURIComponent(fileName);
    return decoded;
  } catch {
    // If that fails, try the escape/unescape method for Latin-1 encoding issues
    try {
      return decodeURIComponent(escape(fileName));
    } catch {
      // If all fails, return original
      return fileName;
    }
  }
}
