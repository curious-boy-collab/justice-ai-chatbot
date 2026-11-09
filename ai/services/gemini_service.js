/**
 * JusticeAI – Gemini API Service
 * Developer: Nitin (AI / RAG Developer)
 * 
 * Modular wrapper for Google Gemini API integration.
 * Adheres strictly to security rules:
 * - API keys are accessed from environment variables on backend only.
 * - Handles rate limits, missing keys, and unexpected API errors gracefully.
 * - Never returns hallucinated facts when context is missing.
 */

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getSystemPrompt } = require('../prompts/system_prompt');
const { buildRAGPrompt } = require('../prompts/query_prompts');

const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const TEMPERATURE = parseFloat(process.env.GEMINI_TEMPERATURE || '0.2');
const MAX_OUTPUT_TOKENS = parseInt(process.env.GEMINI_MAX_OUTPUT_TOKENS || '1024', 10);

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || null;
    this.modelName = DEFAULT_MODEL;
    this.client = null;

    if (this.apiKey) {
      this.client = new GoogleGenerativeAI(this.apiKey);
    }
  }

  /**
   * Check if Gemini API credentials are configured
   * @returns {boolean}
   */
  isConfigured() {
    return Boolean(this.apiKey && this.apiKey !== 'your_gemini_api_key_here');
  }

  /**
   * Generate an answer using retrieved context and Gemini API
   * @param {string} query User query
   * @param {Array<Object>} contextDocs Retrieved knowledge documents
   * @param {string} language 'en' or 'hi'
   * @returns {Promise<{answer: string, modelUsed: string, isLiveModel: boolean}>}
   */
  async generateAnswer(query, contextDocs = [], language = 'en') {
    const systemPrompt = getSystemPrompt(language);
    const fullPrompt = buildRAGPrompt(query, contextDocs, language, systemPrompt);

    // If Gemini API is not yet configured with a live key, return a deterministic fallback
    if (!this.isConfigured()) {
      return this._generateOfflineFallback(query, contextDocs, language);
    }

    try {
      const model = this.client.getGenerativeModel({
        model: this.modelName,
        generationConfig: {
          temperature: TEMPERATURE,
          maxOutputTokens: MAX_OUTPUT_TOKENS,
        },
      });

      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      return {
        answer: text.trim(),
        modelUsed: this.modelName,
        isLiveModel: true,
      };
    } catch (error) {
      console.error('[GeminiService Error]:', error.message);
      // Fallback with context if API call fails
      return this._handleApiError(error, contextDocs, language);
    }
  }

  /**
   * Safe offline fallback using retrieved context when API key is not present
   * @private
   */
  _generateOfflineFallback(query, contextDocs, language) {
    if (contextDocs.length > 0) {
      const primaryDoc = contextDocs[0];
      const summary = primaryDoc.content
        ? primaryDoc.content.split('\n\n').slice(0, 3).join('\n\n')
        : 'Official Department of Justice information available.';

      const prefix = language === 'hi'
        ? `[न्याय विभाग संदर्भ रिकॉर्ड]:\n\n`
        : `[Department of Justice Official Record]:\n\n`;

      return {
        answer: `${prefix}${summary}\n\n${
          language === 'hi'
            ? 'विस्तृत जानकारी हेतु कृपया आधिकारिक पोर्टल पर जाएँ।'
            : 'For more details, please visit the official portal.'
        }`,
        modelUsed: 'context-direct-reference',
        isLiveModel: false,
      };
    }

    return {
      answer: language === 'hi'
        ? 'नमस्ते! मैं JusticeAI हूँ, न्याय विभाग का डिजिटल सहायक। वर्तमान में यह सेवा विकास के चरण में है। न्यायालयों, eCourts, eFiling, Tele-Law और NJDG संबंधी जानकारी के लिए कृपया आधिकारिक वेबसाइट doj.gov.in पर जाएँ।'
        : 'Hello! I am JusticeAI, virtual assistant for the Department of Justice, Government of India. I can assist you with information about courts, eCourts services, eFiling, Tele-Law, NJDG pendency, and Fast Track Courts. For official matters, please visit doj.gov.in.',
      modelUsed: 'system-fallback',
      isLiveModel: false,
    };
  }

  /**
   * Handle errors and quota limits gracefully
   * @private
   */
  _handleApiError(error, contextDocs, language) {
    const isRateLimit = error.message?.includes('429') || error.message?.includes('quota');

    if (contextDocs.length > 0) {
      return this._generateOfflineFallback('query', contextDocs, language);
    }

    const message = language === 'hi'
      ? isRateLimit
        ? 'सेवा पर अनुरोधों की संख्या अधिक है। कृपया कुछ क्षणों बाद पुनः प्रयास करें या सीधे doj.gov.in पर जाएँ।'
        : 'तकनीकी समस्या के कारण उत्तर उत्पन्न नहीं हो सका। कृपया आधिकारिक पोर्टल doj.gov.in पर जाएँ।'
      : isRateLimit
        ? 'The AI service is experiencing high traffic. Please try again shortly or consult the official portal at doj.gov.in.'
        : 'An error occurred while generating the response. Please consult the official Department of Justice portal at doj.gov.in.';

    return {
      answer: message,
      modelUsed: 'error-fallback',
      isLiveModel: false,
    };
  }
}

module.exports = new GeminiService();
