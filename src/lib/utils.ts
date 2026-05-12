/**
 * Formats a date string into DD/MM/YY format
 */
export function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      // Handle "FEB 21, 2025" format if New Date fails
      const months: Record<string, number> = {
        JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
        JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11
      };
      const parts = dateStr.split(/[\s,]+/);
      if (parts.length >= 3) {
        const month = months[parts[0].toUpperCase()];
        const day = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
        if (month !== undefined && !isNaN(day) && !isNaN(year)) {
          const dd = String(day).padStart(2, '0');
          const mm = String(month + 1).padStart(2, '0');
          const yy = String(year).slice(-2);
          return `${dd}/${mm}/${yy}`;
        }
      }
      return dateStr;
    }
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(-2);
    return `${dd}/${mm}/${yy}`;
  } catch {
    return dateStr;
  }
}

/**
 * Calculates read time in minutes based on content
 */
export function calculateReadTime(content: string = "", excerpt: string = ""): string {
  const combinedText = `${excerpt} ${content}`;
  const words = combinedText.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}
