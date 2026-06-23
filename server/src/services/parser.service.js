const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const Tesseract = require('tesseract.js');

/**
 * Parses and extracts text content from a uploaded file buffer based on mimetype.
 * Standardizes support for PDFs, DOCX, and runs Tesseract OCR for PNG/JPEG image files.
 * 
 * DESIGN RATIONALE:
 * - Scanned PDFs will parse to empty/whitespace strings. 
 * - Images (PNG/JPEG) are processed using Tesseract OCR.
 * - This structure keeps the backend lightweight without adding heavy C++ system dependencies.
 * 
 * @param {Buffer} buffer - File data buffer
 * @param {string} mimetype - Incoming file mimetype
 * @returns {Promise<string>} Cleaned raw text content
 */
async function extractText(buffer, mimetype) {
  // 1. Handle PDF Documents
  if (mimetype === 'application/pdf') {
    const data = await pdfParse(buffer);
    const parsedText = data.text ? data.text.trim() : '';
    
    // Scanned PDF check: if PDF has no embedded text (scanned image)
    if (parsedText.length < 50) {
      console.warn('PDF parsed text length is very short. Scanned PDF detected without OCR fallback.');
      throw new Error(
        'The uploaded PDF appears to be a scanned document. Please upload a text-based PDF, or a PNG/JPEG screenshot of the resume for OCR processing.'
      );
    }
    return parsedText;
  }

  // 2. Handle DOCX Microsoft Word Documents
  if (
    mimetype ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    const { value } = await mammoth.extractRawText({ buffer });
    return value ? value.trim() : '';
  }

  // 3. Handle Images (PNG/JPEG) using Tesseract.js OCR engine
  if (mimetype === 'image/png' || mimetype === 'image/jpeg') {
    console.log(`Starting Tesseract OCR parsing for image type: ${mimetype}`);
    const { data: { text } } = await Tesseract.recognize(
      buffer,
      'eng',
      { logger: m => console.log(`[OCR Process] ${m.status}: ${Math.round(m.progress * 100)}%`) }
    );
    return text ? text.trim() : '';
  }

  throw new Error(`Unsupported mimetype: ${mimetype}`);
}

module.exports = { extractText };
