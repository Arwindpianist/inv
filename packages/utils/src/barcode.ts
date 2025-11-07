/**
 * Validate barcode format
 * Supports common formats: EAN-13, EAN-8, UPC-A, UPC-E, Code 128
 */
export function validateBarcode(barcode: string): boolean {
  if (!barcode || barcode.length < 8 || barcode.length > 13) {
    return false;
  }

  // Check if all characters are digits
  if (!/^\d+$/.test(barcode)) {
    return false;
  }

  // EAN-13 validation (13 digits)
  if (barcode.length === 13) {
    return validateEAN13(barcode);
  }

  // EAN-8 validation (8 digits)
  if (barcode.length === 8) {
    return validateEAN8(barcode);
  }

  // UPC-A validation (12 digits)
  if (barcode.length === 12) {
    return validateUPCA(barcode);
  }

  // Code 128 or other formats (8-13 digits)
  return true;
}

/**
 * Validate EAN-13 barcode checksum
 */
function validateEAN13(barcode: string): boolean {
  const digits = barcode.split("").map(Number);
  let sum = 0;

  for (let i = 0; i < 12; i++) {
    sum += digits[i] * (i % 2 === 0 ? 1 : 3);
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === digits[12];
}

/**
 * Validate EAN-8 barcode checksum
 */
function validateEAN8(barcode: string): boolean {
  const digits = barcode.split("").map(Number);
  let sum = 0;

  for (let i = 0; i < 7; i++) {
    sum += digits[i] * (i % 2 === 0 ? 3 : 1);
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === digits[7];
}

/**
 * Validate UPC-A barcode checksum
 */
function validateUPCA(barcode: string): boolean {
  const digits = barcode.split("").map(Number);
  let sum = 0;

  for (let i = 0; i < 11; i++) {
    sum += digits[i] * (i % 2 === 0 ? 3 : 1);
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === digits[11];
}

/**
 * Normalize barcode format (remove spaces, dashes)
 */
export function normalizeBarcode(barcode: string): string {
  return barcode.replace(/[\s-]/g, "");
}

/**
 * Generate a unique barcode (for testing or auto-generation)
 */
export function generateBarcode(prefix = "200"): string {
  const random = Math.floor(Math.random() * 1000000000).toString().padStart(9, "0");
  const barcode = prefix + random;
  
  // Calculate check digit for EAN-13
  const digits = barcode.split("").map(Number);
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += digits[i] * (i % 2 === 0 ? 1 : 3);
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  
  return barcode + checkDigit;
}

