/**
 * JusticeAI – Enhanced Gemini API Service
 * Developer: Nitin (AI / RAG Developer)
 * Sprint: Day 3 — RAG Implementation & Context Grounding
 * 
 * Provides:
 * - Dynamic server-side API key configuration via backend.
 * - Multi-model support with resilient error handling and timeouts.
 * - Grounded contextual generation with official government citations.
 * - Graceful fallback responses when no relevant document is retrieved.
 */

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getSystemPrompt } = require('../prompts/system_prompt');
const { buildRAGPrompt } = require('../prompts/query_prompts');
const { INTENTS } = require('../retrieval/intent_classifier');

const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const TEMPERATURE = parseFloat(process.env.GEMINI_TEMPERATURE || '0.2');
const MAX_OUTPUT_TOKENS = parseInt(process.env.GEMINI_MAX_OUTPUT_TOKENS || '1024', 10);

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || null;
    this.modelName = DEFAULT_MODEL;
    this.client = null;

    if (this.apiKey && this.apiKey !== 'your_gemini_api_key_here') {
      this.client = new GoogleGenerativeAI(this.apiKey);
    }
  }

  /**
   * Set API key dynamically (configured server-side via Disha's backend)
   * @param {string} key Gemini API key
   */
  setApiKey(key) {
    if (key && typeof key === 'string' && key.trim() && key !== 'your_gemini_api_key_here') {
      this.apiKey = key.trim();
      this.client = new GoogleGenerativeAI(this.apiKey);
    }
  }

  /**
   * Check if Gemini API credentials are configured
   * @returns {boolean}
   */
  isConfigured() {
    return Boolean(this.apiKey && this.apiKey !== 'your_gemini_api_key_here' && this.client);
  }

  /**
   * Generate an answer using retrieved context and Gemini API
   * @param {string} query User query
   * @param {Array<Object>} contextDocs Retrieved knowledge documents
   * @param {string} language 'en' or 'hi'
   * @param {Object} intentAnalysis Pre-analyzed intent and entities
   * @param {boolean} hasMatches Whether semantic search found matching documents
   * @returns {Promise<{
   *   answer: string,
   *   modelUsed: string,
   *   isLiveModel: boolean,
   *   isFallback: boolean,
   *   durationMs: number
   * }>}
   */
  async generateAnswer(query, contextDocs = [], language = 'en', intentAnalysis = null, hasMatches = true) {
    const startTime = Date.now();
    const isHindi = language === 'hi';

    // 1. Guardrail Check: Prohibited legal advice or case prediction
    if (intentAnalysis && intentAnalysis.intent === INTENTS.LEGAL_ADVICE_PROHIBITED) {
      return {
        answer: isHindi
          ? 'न्याय विभाग के डिजिटल सहायक के रूप में, मैं केवल प्रक्रियात्मक व कानूनी सेवाओं की जानकारी प्रदान करता हूँ। मैं किसी मुकदमे के फैसले की भविष्यवाणी या कानूनी रणनीति की सलाह नहीं दे सकता। किसी भी विधिक परामर्श के लिए कृपया किसी अधिवक्ता से संपर्क करें या टेली-लॉ (https://www.tele-law.in) के माध्यम से निःशुल्क कानूनी सहायता प्राप्त करें।'
          : 'As an AI Virtual Assistant for the Department of Justice, I provide procedural and judicial information only. I cannot offer professional legal counsel, legal strategies, or predict court outcomes. For legal advice, please consult a qualified advocate or seek free legal aid through Tele-Law at https://www.tele-law.in.',
        modelUsed: 'guardrail-policy-engine',
        isLiveModel: false,
        isFallback: true,
        durationMs: Date.now() - startTime,
      };
    }

    // 2. Guardrail Check: Out-of-Scope queries
    if (intentAnalysis && intentAnalysis.intent === INTENTS.OUT_OF_SCOPE) {
      return {
        answer: isHindi
          ? 'नमस्ते! मैं JusticeAI हूँ, जो भारत सरकार के न्याय विभाग (Department of Justice) की नागरिक सेवाओं में सहायता के लिए समर्पित है। मैं न्यायालयों, ई-कोर्ट्स, टेली-लॉ, मुकदमों की स्थिति, और ट्रैफिक चालान से संबंधित प्रश्नों के उत्तर दे सकता हूँ। न्याय विभाग के अधिकार क्षेत्र से बाहर के प्रश्नों पर मैं जानकारी नहीं दे सकता।'
          : 'Hello! I am JusticeAI, dedicated to assisting citizens with Department of Justice services (eCourts, Tele-Law, NJDG, case status, judge vacancies, eFiling, and traffic fines). I cannot assist with topics outside the Department of Justice mandate. Please ask a question related to Indian judicial services or visit https://doj.gov.in.',
        modelUsed: 'guardrail-scope-filter',
        isLiveModel: false,
        isFallback: true,
        durationMs: Date.now() - startTime,
      };
    }

    // 3. Greetings
    if (intentAnalysis && intentAnalysis.intent === INTENTS.GREETING) {
      return {
        answer: isHindi
          ? 'नमस्ते! 🙏 मैं भारत सरकार के विधि एवं न्याय मंत्रालय के न्याय विभाग का आभासी सहायक (JusticeAI) हूँ। मैं केस स्टेटस (CNR नंबर), न्यायाधीशों के स्वीकृत पद, NJDG आँकड़े, ई-फाइलिंग, ई-पे, टेली-लॉ तथा वर्चुअल कोर्ट ट्रैफिक चालान की जानकारी दे सकता हूँ। मैं आपकी क्या सहायता कर सकता हूँ?'
          : 'Namaste! 🙏 I am JusticeAI, the official Virtual Assistant for the Department of Justice, Ministry of Law & Justice, Government of India. I can assist you with case status lookup, judge appointments & vacancies, court pendency statistics (NJDG), eFiling, ePay, Tele-Law, and Virtual Courts traffic fine procedures. How can I assist you today?',
        modelUsed: 'greeting-handler',
        isLiveModel: false,
        isFallback: false,
        durationMs: Date.now() - startTime,
      };
    }

    // 4. Fallback when no relevant document is found
    if (!hasMatches && contextDocs.length === 0) {
      return {
        answer: isHindi
          ? 'न्याय विभाग के ज्ञानकोष में आपके प्रश्न से सीधा संबंधित कोई सत्यापित रिकॉर्ड नहीं मिला। न्यायिक सेवाओं, केस स्थिति, अथवा सरकारी योजनाओं की आधिकारिक जानकारी के लिए कृपया न्याय विभाग के आधिकारिक पोर्टल https://doj.gov.in पर जाएँ अथवा टेली-लॉ नागरिक हेल्पलाइन 14416 (टोल-फ्री) पर संपर्क करें।'
          : 'I could not find verified records directly matching your query in the Department of Justice knowledge base. For verified guidance on court services, case status, or legal schemes, please explore the official portal at https://doj.gov.in or contact the Tele-Law Citizen Helpline at 14416 (Toll-Free).',
        modelUsed: 'no-relevant-document-fallback',
        isLiveModel: false,
        isFallback: true,
        durationMs: Date.now() - startTime,
      };
    }

    // 5. Generate with live Gemini model if configured
    if (this.isConfigured()) {
      try {
        const systemPrompt = getSystemPrompt(language);
        const fullPrompt = buildRAGPrompt(query, contextDocs, language, systemPrompt);

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
          isFallback: false,
          durationMs: Date.now() - startTime,
        };
      } catch (error) {
        console.warn('[GeminiService] Live API invocation failed, falling back to grounded context:', error.message);
      }
    }

    // 6. High-fidelity grounded context fallback (deterministic offline execution)
    return this._generateContextualFallback(query, contextDocs, language, startTime);
  }

  /**
   * Deterministic grounded response built from verified official documents
   * @private
   */
  _generateContextualFallback(query, contextDocs, language, startTime) {
    const isHindi = language === 'hi';

    if (contextDocs.length > 0) {
      const topDoc = contextDocs[0];
      const paragraphs = topDoc.content
        .split('\n\n')
        .filter(p => !p.startsWith('#') && !p.startsWith('>') && !p.startsWith('Category:') && !p.startsWith('Source URL:'))
        .slice(0, 3)
        .join('\n\n');

      const prefix = isHindi
        ? `**न्याय विभाग आधिकारिक संदर्भ [${topDoc.metadata?.title || 'सत्यापित रिकॉर्ड'}]:**\n\n`
        : `**Department of Justice Official Record [${topDoc.metadata?.title || 'Verified Record'}]:**\n\n`;

      let statisticsNote = '';
      const docTitleCategory = `${topDoc.metadata?.title || ''} ${topDoc.metadata?.category || ''}`.toLowerCase();
      if (docTitleCategory.includes('vacanc') || 
          docTitleCategory.includes('pendency') ||
          docTitleCategory.includes('njdg') ||
          docTitleCategory.includes('judge')) {
        statisticsNote = isHindi
          ? '\n\n*सूचना: न्यायिक आँकड़े और रिक्तियाँ प्रतिदिन अद्यतन होती हैं। कृपया ताज़ा व वास्तविक समय के आधिकारिक आँकड़ों के लिए https://njdg.ecourts.gov.in तथा https://doj.gov.in पर देखें।*'
          : '\n\n*Official Notice: Judicial vacancy figures and case counts fluctuate continuously on business days. For real-time live official counts, please refer directly to https://njdg.ecourts.gov.in and https://doj.gov.in.*';
      }

      const footer = isHindi
        ? `${statisticsNote}\n\nविस्तृत जानकारी एवं आधिकारिक सेवाओं के लिए कृपया आधिकारिक पोर्टल पर जाएँ: ${topDoc.metadata?.url || 'https://doj.gov.in'}${topDoc.metadata?.helpline ? ` | हेल्पलाइन: ${topDoc.metadata.helpline}` : ''}`
        : `${statisticsNote}\n\nFor verified details and online services, please visit the official portal: ${topDoc.metadata?.url || 'https://doj.gov.in'}${topDoc.metadata?.helpline ? ` | Helpline: ${topDoc.metadata.helpline}` : ''}`;

      return {
        answer: `${prefix}${paragraphs}${footer}`,
        modelUsed: 'grounded-context-retrieval',
        isLiveModel: false,
        isFallback: false,
        durationMs: Date.now() - startTime,
      };
    }

    return {
      answer: isHindi
        ? 'नमस्ते! मैं JusticeAI हूँ। इस विषय पर विशिष्ट जानकारी उपलब्ध नहीं है। कृपया न्याय विभाग के आधिकारिक पोर्टल https://doj.gov.in अथवा ई-कोर्ट्स पोर्टल https://ecourts.gov.in पर देखें।'
        : 'Hello! I am JusticeAI. Verified records for this specific inquiry are not available. Please visit the official Department of Justice portal at https://doj.gov.in or eCourts at https://ecourts.gov.in.',
      modelUsed: 'system-default-fallback',
      isLiveModel: false,
      isFallback: true,
      durationMs: Date.now() - startTime,
    };
  }
}

module.exports = new GeminiService();
