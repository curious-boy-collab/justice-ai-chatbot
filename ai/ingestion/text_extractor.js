/**
 * Text Extractor & Cleaner
 * Developer: Nitin (AI / RAG Developer)
 * 
 * Normalizes text extracted from Markdown, text files, and HTML/PDF scraps.
 */

/**
 * Clean and normalize text
 * - Removes excess whitespaces and trailing blanks
 * - Normalizes Unicode punctuation (smart quotes, dashes)
 * - Retains essential markdown formatting for headings and lists
 * @param {string} text Raw text
 * @returns {string} Cleaned text
 */
function cleanText(text) {
  if (!text || typeof text !== 'string') return '';

  return text
    .replace(/\r\n/g, '\n')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Extracts sections delimited by markdown headers (## or ###)
 * @param {string} content Markdown document content
 * @returns {Array<{title: string, body: string}>}
 */
function extractSections(content) {
  const lines = content.split('\n');
  const sections = [];
  let currentTitle = 'Introduction';
  let currentBody = [];

  for (const line of lines) {
    const headerMatch = line.match(/^#{2,3}\s+(.+)$/);
    if (headerMatch) {
      if (currentBody.length > 0) {
        sections.push({
          title: currentTitle,
          body: currentBody.join('\n').trim(),
        });
        currentBody = [];
      }
      currentTitle = headerMatch[1].trim();
    } else {
      currentBody.push(line);
    }
  }

  if (currentBody.length > 0) {
    sections.push({
      title: currentTitle,
      body: currentBody.join('\n').trim(),
    });
  }

  return sections;
}

module.exports = { cleanText, extractSections };
