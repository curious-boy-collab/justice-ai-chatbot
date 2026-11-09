/**
 * JusticeAI Document Loader
 * Developer: Nitin (AI / RAG Developer)
 * 
 * Traverses ai/documents/ recursively, reads markdown files,
 * and extracts structured metadata (Category, Source URL, Date, Verification Status).
 */

const fs = require('fs');
const path = require('path');

const DOCUMENTS_BASE_DIR = path.join(__dirname, '..', 'documents');

/**
 * Parses header block metadata from Markdown document
 * @param {string} content Raw markdown content
 * @returns {Object} Structured metadata
 */
function parseMetadata(content) {
  const metadata = {
    title: 'DoJ Knowledge Document',
    category: 'General',
    url: 'https://doj.gov.in',
    lastChecked: '2026-11-08',
    status: 'Verified Official Government Data',
  };

  const titleMatch = content.match(/^#\s+(.+)$/m);
  if (titleMatch) metadata.title = titleMatch[1].trim();

  const categoryMatch = content.match(/>\s*\*\*Category:\*\*\s*(.+)$/m);
  if (categoryMatch) metadata.category = categoryMatch[1].trim();

  const urlMatch = content.match(/>\s*\*\*Source URL:\*\*\s*(https?:\/\/\S+)/im);
  if (urlMatch) metadata.url = urlMatch[1].trim();

  const dateMatch = content.match(/>\s*\*\*Retrieval Date:\*\*\s*(.+)$/m);
  if (dateMatch) metadata.lastChecked = dateMatch[1].trim();

  const statusMatch = content.match(/>\s*\*\*Verification Status:\*\*\s*(.+)$/m);
  if (statusMatch) metadata.status = statusMatch[1].trim();

  return metadata;
}

/**
 * Recursively retrieves all markdown files from a directory
 * @param {string} dir Directory path
 * @returns {Array<string>} List of file paths
 */
function getAllMarkdownFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getAllMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Loads all knowledge documents as structured objects
 * @returns {Array<Object>} List of documents with id, content, and metadata
 */
function loadAllDocuments() {
  const files = getAllMarkdownFiles(DOCUMENTS_BASE_DIR);
  const documents = [];

  for (const file of files) {
    try {
      const raw = fs.readFileSync(file, 'utf8');
      const metadata = parseMetadata(raw);
      const relativePath = path.relative(DOCUMENTS_BASE_DIR, file);

      documents.push({
        id: relativePath.replace(/\\/g, '/').replace('.md', ''),
        filePath: file,
        metadata,
        content: raw,
      });
    } catch (err) {
      console.error(`[DocumentLoader] Error reading ${file}:`, err.message);
    }
  }

  return documents;
}

if (require.main === module) {
  const docs = loadAllDocuments();
  console.log(`[DocumentLoader] Loaded ${docs.length} official documents successfully.`);
  docs.forEach((d, idx) => console.log(`  ${idx + 1}. [${d.metadata.category}] ${d.metadata.title}`));
}

module.exports = { loadAllDocuments, parseMetadata };
