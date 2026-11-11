/**
 * Document Chunker
 * Developer: Nitin (AI / RAG Developer)
 * 
 * Splits documents and sections into semantic chunks with token/word overlap
 * suitable for vector embedding and retrieval.
 */

const { cleanText, extractSections } = require('./text_extractor');

const DEFAULT_CHUNK_SIZE = 500; // Approximate word limit per chunk
const DEFAULT_CHUNK_OVERLAP = 75; // Overlap words to maintain context across boundaries

/**
 * Splits text into chunks by words with specified overlap
 * @param {string} text Text to split
 * @param {number} chunkSize Max words per chunk
 * @param {number} overlap Overlap words
 * @returns {Array<string>} Chunks of text
 */
function chunkByWords(text, chunkSize = DEFAULT_CHUNK_SIZE, overlap = DEFAULT_CHUNK_OVERLAP) {
  const words = cleanText(text).split(/\s+/).filter(Boolean);
  if (words.length <= chunkSize) {
    return [words.join(' ')];
  }

  const chunks = [];
  let start = 0;

  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length);
    const chunkWords = words.slice(start, end);
    chunks.push(chunkWords.join(' '));

    if (end >= words.length) break;
    start += (chunkSize - overlap);
  }

  return chunks;
}

/**
 * Creates structured chunks from a loaded knowledge document
 * Preserves parent document metadata and section titles
 * @param {Object} document Document from document_loader
 * @returns {Array<Object>} List of chunk objects ready for embedding
 */
function createDocumentChunks(document) {
  const sections = extractSections(document.content);
  const chunks = [];
  let chunkIndex = 0;

  for (const section of sections) {
    const sectionChunks = chunkByWords(section.body);
    for (const text of sectionChunks) {
      if (!text || text.length < 30) continue; // Skip trivial fragments

      chunks.push({
        id: `${document.id}#chunk-${chunkIndex++}`,
        docId: document.id,
        sectionTitle: section.title,
        content: `### ${section.title}\n\n${text}`,
        metadata: {
          ...document.metadata,
          sectionTitle: section.title,
          chunkIndex,
        },
      });
    }
  }

  return chunks;
}

module.exports = { chunkByWords, createDocumentChunks };
