const DANGEROUS_PREFIXES = ['=', '+', '-', '@', '\t', '\r'];

/**
 * Escapes a single CSV field: neutralizes formula-injection prefixes and
 * quotes the value per RFC 4180 whenever it contains a comma, quote or newline.
 */
export function sanitizeCsvField(value) {
  if (value === null || value === undefined) return '';

  let text = String(value);

  // Neutralize spreadsheet formula injection by prefixing a leading apostrophe.
  if (DANGEROUS_PREFIXES.some((prefix) => text.startsWith(prefix))) {
    text = `'${text}`;
  }

  if (/[",\n\r]/.test(text)) {
    text = `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

export function toCsvRow(values) {
  return values.map(sanitizeCsvField).join(',') + '\r\n';
}

export default sanitizeCsvField;
