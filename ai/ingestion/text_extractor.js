/**
 * Text Extractor & Cleaner
 * Developer: Nitin (AI / RAG Developer)
 * Sprint: Day 3 — RAG Implementation & Multi-Format Ingestion
 * 
 * Supports text extraction and normalization from:
 * - Markdown (.md)
 * - Plain Text (.txt)
 * - PDF documents (.pdf)
 */

/**
 * Clean and normalize text extracted from documents
 * - Removes excess whitespaces, page boundaries, and trailing blanks
 * - Normalizes Unicode punctuation (smart quotes, dashes, ellipses)
 * - Retains structural formatting for headings and lists
 * @param {string} text Raw text
 * @returns {string} Cleaned text
 */
function cleanText(text) {
  if (!text || typeof text !== 'string') return '';

  return text
    .replace(/\r\n/g, '\n')
    .replace(/--\s*\d+\s+of\s+\d+\s*--/gi, '') // Strip PDF page numbering artifacts
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Extracts sections delimited by markdown headers (## or ###) or logical text blocks
 * @param {string} content Document content
 * @returns {Array<{title: string, body: string}>}
 */
function extractSections(content) {
  if (!content) return [];
  const lines = cleanText(content).split('\n');
  const sections = [];
  let currentTitle = 'Overview & Background';
  let currentBody = [];

  for (const line of lines) {
    // Check for Markdown headers (## or ###) or ALL-CAPS section headers (e.g., "OVERVIEW:", "ELIGIBILITY CRITERIA:")
    const headerMatch = line.match(/^#{1,3}\s+(.+)$/) || line.match(/^([A-Z\s]{4,}):$/);
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

  // If no sections were identified, return entire body as a single section
  if (sections.length === 0 && content.trim().length > 0) {
    sections.push({
      title: 'General Information',
      body: cleanText(content),
    });
  }

  return sections;
}

/**
 * Parses structured metadata from raw text (supports both Markdown and Plain Text headers)
 * @param {string} content Raw text
 * @param {string} filename File basename
 * @returns {Object} Structured metadata
 */
function extractMetadata(content, filename = '') {
  const metadata = {
    title: filename.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
    category: 'Department of Justice',
    portal: 'Department of Justice Official Portal',
    url: 'https://doj.gov.in',
    secondaryUrl: '',
    helpline: '14416 (Tele-Law Toll-Free) / doj@gov.in',
    lastChecked: '2026-11-12',
    status: 'Verified Official Government Data',
    freshness: 'Official baseline (live statistics fluctuate dynamically; verify on official portal)',
  };

  const titleMatch = content.match(/^#\s+(.+)$/m) || content.match(/^Title:\s*(.+)$/im);
  if (titleMatch) metadata.title = titleMatch[1].trim();

  const categoryMatch = content.match(/>?\s*\*?\*?Category:\*?\*?\s*(.+)$/im);
  if (categoryMatch) metadata.category = categoryMatch[1].trim();

  const portalMatch = content.match(/>?\s*\*?\*?(?:Source\s+Portal|Official\s+Portal):\*?\*?\s*(.+)$/im);
  if (portalMatch) metadata.portal = portalMatch[1].trim();

  const urlMatch = content.match(/>?\s*\*?\*?Source URL:\*?\*?\s*(https?:\/\/\S+)/im);
  if (urlMatch) metadata.url = urlMatch[1].trim();

  const secondaryMatch = content.match(/>?\s*\*?\*?(?:Secondary\s+Portal|Secondary\s+URL|Secondary\s+Source|Payment\s+Portal|Dedicated\s+Portal):\*?\*?\s*(https?:\/\/\S+)/im);
  if (secondaryMatch) metadata.secondaryUrl = secondaryMatch[1].trim();

  const helplineMatch = content.match(/>?\s*\*?\*?(?:Helpline|Helpline\s*\/\s*Portal|Official\s+Helpline\s*\/\s*Nodal\s+Desk):\*?\*?\s*(.+)$/im);
  if (helplineMatch) metadata.helpline = helplineMatch[1].trim();

  const dateMatch = content.match(/>?\s*\*?\*?Retrieval Date:\*?\*?\s*(.+)$/im);
  if (dateMatch) metadata.lastChecked = dateMatch[1].trim();

  const statusMatch = content.match(/>?\s*\*?\*?Verification Status:\*?\*?\s*(.+)$/im);
  if (statusMatch) metadata.status = statusMatch[1].trim();

  const freshnessMatch = content.match(/>?\s*\*?\*?Data Freshness:\*?\*?\s*(.+)$/im);
  if (freshnessMatch) metadata.freshness = freshnessMatch[1].trim();

  return metadata;
}

module.exports = {
  cleanText,
  extractSections,
  extractMetadata,
};
