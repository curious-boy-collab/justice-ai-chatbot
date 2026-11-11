/**
 * Query Prompts and Context Assembly for JusticeAI RAG
 * Developer: Nitin (AI / RAG Developer)
 */

/**
 * Builds the complete RAG prompt sent to Gemini API
 * @param {string} query User query
 * @param {Array<Object>} contextDocs Retrieved knowledge chunks
 * @param {string} language 'en' or 'hi'
 * @param {string} systemPrompt Base system prompt
 * @returns {string} Formatted prompt string
 */
function buildRAGPrompt(query, contextDocs = [], language = 'en', systemPrompt = '') {
  const isHindi = language === 'hi';

  let contextBlock = '';
  if (contextDocs && contextDocs.length > 0) {
    contextBlock = contextDocs.map((doc, idx) => {
      const title = doc.metadata?.title || `Document ${idx + 1}`;
      const source = doc.metadata?.url || 'Official Department of Justice Portal';
      const lastChecked = doc.metadata?.lastChecked || '2026-11-01';
      return `[RECORD ${idx + 1}: ${title}]\nSource URL: ${source}\nVerified Date: ${lastChecked}\nContent:\n${doc.content}`;
    }).join('\n\n---\n\n');
  } else {
    contextBlock = isHindi
      ? 'सत्यापित संदर्भ रिकॉर्ड: कोई विशिष्ट दस्तावेज़ प्राप्त नहीं हुआ।'
      : 'VERIFIED CONTEXT: No specific reference documents retrieved.';
  }

  const instructions = isHindi
    ? `निर्देश:
1. ऊपर दिए गए आधिकारिक संदर्भ दस्तावेज़ों का प्रयोग करके उत्तर दें।
2. भाषा: शुद्ध और स्पष्ट हिंदी (देवनागरी लिपि)।
3. यदि जानकारी संदर्भ में न हो, तो स्पष्ट कहें कि यह जानकारी उपलब्ध नहीं है और आधिकारिक पोर्टल (doj.gov.in) का उल्लेख करें।
4. कभी भी फर्जी आंकड़े या कानूनी परिणाम न बनाएं।
5. उत्तर के अंत में आधिकारिक स्रोत लिंक सम्मिलित करें।`
    : `INSTRUCTIONS:
1. Answer using the official context records provided above.
2. Language: Clear, professional English accessible to ordinary citizens.
3. If the answer is not contained in the context, explicitly state that verified records are not available and refer to the official portal (doj.gov.in).
4. NEVER fabricate judge statistics, case pendency, or case outcomes.
5. Include relevant official government links at the end of your answer.`;

  return `${systemPrompt}

==================== OFFICIAL VERIFIED CONTEXT ====================
${contextBlock}
==================== END OF VERIFIED CONTEXT ====================

CITIZEN QUESTION:
${query}

${instructions}

ASSISTANT RESPONSE:`;
}

module.exports = { buildRAGPrompt };
