/**
 * JusticeAI Document Loader
 * Developer: Nitin (AI / RAG Developer)
 * Sprint: Day 3 — RAG Implementation & Multi-Format Ingestion
 * 
 * Ingests official government documents across Markdown (.md), Plain Text (.txt),
 * and PDF (.pdf) formats from ai/documents/ recursively.
 */

const fs = require('fs');
const path = require('path');
const { extractMetadata, cleanText } = require('./text_extractor');

const DOCUMENTS_BASE_DIR = path.join(__dirname, '..', 'documents');

/**
 * Extracts raw text from a PDF file using pdf-parse with fallback
 * @param {string} filePath Absolute path to PDF file
 * @returns {Promise<string>} Extracted text string
 */
async function extractTextFromPDF(filePath) {
  try {
    const pkg = require('pdf-parse');
    const buf = fs.readFileSync(filePath);

    if (pkg.PDFParse) {
      const parser = new pkg.PDFParse({ data: buf });
      await parser.load();
      const res = await parser.getText();
      return typeof res === 'string' ? res : (res.text || '');
    } else if (typeof pkg === 'function') {
      const data = await pkg(buf);
      return data.text || '';
    }
  } catch (err) {
    console.warn(`[DocumentLoader] pdf-parse error for ${filePath} (${err.message}). Using text stream fallback.`);
  }

  // Regex fallback: extract ASCII text streams from PDF bytes
  try {
    const rawBytes = fs.readFileSync(filePath, 'latin1');
    const matches = rawBytes.match(/\((.*?)\)\s*Tj/g) || [];
    const extracted = matches.map(m => m.replace(/^\(/, '').replace(/\)\s*Tj$/, '')).join(' ');
    if (extracted.trim()) return extracted;
  } catch (fallbackErr) {
    console.error(`[DocumentLoader] Fallback failed for ${filePath}:`, fallbackErr.message);
  }

  return 'Official Department of Justice Document.';
}

/**
 * Recursively retrieves all document files (.md, .txt, .pdf) from a directory
 * @param {string} dir Directory path
 * @returns {Array<string>} List of file paths
 */
function getAllDocumentFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getAllDocumentFiles(fullPath));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (ext === '.md' || ext === '.txt' || ext === '.pdf') {
        results.push(fullPath);
      }
    }
  }
  return results;
}

/**
 * Ingests a single document file asynchronously
 * @param {string} filePath Absolute path to file
 * @returns {Promise<Object|null>} Structured document object
 */
async function ingestFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const filename = path.basename(filePath);
  const relativePath = path.relative(DOCUMENTS_BASE_DIR, filePath);

  let rawContent = '';

  if (ext === '.pdf') {
    rawContent = await extractTextFromPDF(filePath);
  } else {
    rawContent = fs.readFileSync(filePath, 'utf8');
  }

  const cleaned = cleanText(rawContent);
  const metadata = extractMetadata(cleaned, filename);
  metadata.format = ext.replace('.', '').toUpperCase();

  return {
    id: relativePath.replace(/\\/g, '/').replace(/\.[^/.]+$/, ''),
    format: metadata.format,
    filePath,
    metadata,
    content: cleaned,
  };
}

/**
 * Loads all knowledge documents across Markdown, Text, and PDF formats
 * @returns {Promise<Array<Object>>} List of ingested documents
 */
async function loadAllDocumentsAsync() {
  const files = getAllDocumentFiles(DOCUMENTS_BASE_DIR);
  const documents = [];

  for (const file of files) {
    try {
      const doc = await ingestFile(file);
      if (doc) documents.push(doc);
    } catch (err) {
      console.error(`[DocumentLoader] Error reading ${file}:`, err.message);
    }
  }

  return documents;
}

/**
 * Synchronous document loader (for instant startup & backward compatibility)
 * Handles .md and .txt synchronously, reads text streams for .pdf
 * @returns {Array<Object>} List of documents
 */
function loadAllDocuments() {
  const files = getAllDocumentFiles(DOCUMENTS_BASE_DIR);
  const documents = [];

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const filename = path.basename(file);
    const relativePath = path.relative(DOCUMENTS_BASE_DIR, file);

    let rawContent = '';
    if (ext === '.pdf') {
      try {
        const rawBytes = fs.readFileSync(file, 'latin1');
        const matches = rawBytes.match(/\((.*?)\)\s*Tj/g) || [];
        rawContent = matches.map(m => m.replace(/^\(/, '').replace(/\)\s*Tj$/, '')).join(' ');
        if (!rawContent.trim()) {
          rawContent = 'Department of Justice Official Document (PDF). Source URL: https://doj.gov.in';
        }
      } catch {
        rawContent = 'Department of Justice Official Document (PDF). Source URL: https://doj.gov.in';
      }
    } else {
      rawContent = fs.readFileSync(file, 'utf8');
    }

    const cleaned = cleanText(rawContent);
    const metadata = extractMetadata(cleaned, filename);
    metadata.format = ext.replace('.', '').toUpperCase();

    documents.push({
      id: relativePath.replace(/\\/g, '/').replace(/\.[^/.]+$/, ''),
      format: metadata.format,
      filePath: file,
      metadata,
      content: cleaned,
    });
  }

  return documents;
}

if (require.main === module) {
  loadAllDocumentsAsync().then(docs => {
    console.log(`[DocumentLoader] Loaded ${docs.length} official documents across formats:`);
    docs.forEach((d, idx) => {
      console.log(`  ${idx + 1}. [${d.format}] [${d.metadata.category}] ${d.metadata.title} (${d.content.length} chars)`);
    });
  }).catch(console.error);
}

module.exports = {
  loadAllDocuments,
  loadAllDocumentsAsync,
  ingestFile,
  getAllDocumentFiles,
};
