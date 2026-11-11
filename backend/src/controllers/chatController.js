import { randomUUID } from 'crypto';
import { queryJusticeAI, OFFICIAL_DATA_FRESHNESS } from '../services/aiBridgeService.js';
import { judgeService } from '../services/judgeService.js';
import { njdgService } from '../services/njdgService.js';
import { eCourtsService } from '../services/eCourtsService.js';
import { config } from '../config/env.js';

/**
 * Generates contextual suggested follow-up questions
 */
function getSuggestedQuestions(intent, language) {
  const isHi = language === 'hi';

  switch (intent) {
    case 'JUDGES_AND_VACANCIES':
      return isHi
        ? [
            'राष्ट्रीय न्यायिक डेटा ग्रिड (NJDG) में लंबित मामलों की स्थिति क्या है?',
            'ई-चालान का भुगतान वर्चुअल कोर्ट से कैसे करें?',
            'टेली-लॉ के तहत मुफ्त कानूनी सलाह कैसे पाएं?'
          ]
        : [
            'What is the total case pendency on NJDG?',
            'How can I pay my traffic fine online via Virtual Court?',
            'Who is eligible for free legal aid through Tele-Law?'
          ];

    case 'NJDG_PENDENCY':
      return isHi
        ? [
            'सर्वोच्च न्यायालय और उच्च न्यायालयों में न्यायाधीशों के कितने पद रिक्त हैं?',
            'ई-फाइलिंग 3.0 के माध्यम से केस कैसे दर्ज करें?',
            'ई-कोर्ट्स सर्विसेज मोबाइल ऐप कैसे डाउनलोड करें?'
          ]
        : [
            'What is the current judge vacancy count in High Courts?',
            'What are the steps for eFiling 3.0?',
            'How do I download the eCourts Services mobile app?'
          ];

    case 'TRAFFIC_FINES':
      return isHi
        ? [
            'अगर मैं चालान को कोर्ट में चुनौती देना चाहता हूं तो क्या होगा?',
            'ई-कोर्ट्स पोर्टल पर केस का स्टेटस कैसे चेक करें?',
            'टेली-लॉ योजना क्या है?'
          ]
        : [
            'Can I contest a traffic challan in a regular court?',
            'How do I check case status using a CNR number?',
            'What are the judicial statistics on the NJDG portal?'
          ];

    case 'EFILING_EPAY':
      return isHi
        ? [
            'ePay पोर्टल पर भुगतान के कौन से विकल्प उपलब्ध हैं?',
            'eCourts Services मोबाइल ऐप का उपयोग कैसे करें?',
            'फास्ट ट्रैक विशेष न्यायालय (FTSC) क्या हैं?'
          ]
        : [
            'What payment methods are supported on ePay?',
            'How do I register on the eCourts mobile app?',
            'What is the Fast Track Special Courts (FTSC) scheme?'
          ];

    case 'TELE_LAW':
      return isHi
        ? [
            'कॉमन सर्विस सेंटर (CSC) पर टेली-लॉ की सुविधा कैसे लें?',
            'क्या टेली-लॉ परामर्श पूरी तरह मुफ्त है?',
            'न्याय विभाग के प्रमुख प्रभाग (Divisions) कौन से हैं?'
          ]
        : [
            'How can I find the nearest Common Service Centre (CSC)?',
            'Is legal representation covered under Tele-Law?',
            'What are the key divisions of the Department of Justice?'
          ];

    case 'FAST_TRACK_COURTS':
      return isHi
        ? [
            'NJDG पर POCSO मामलों की पेंडेंसी कैसे देखें?',
            'टेली-लॉ से निःशुल्क कानूनी सहायता कैसे प्राप्त करें?'
          ]
        : [
            'How do I view POCSO pendency statistics on NJDG?',
            'Who is eligible for free legal advice in Tele-Law?'
          ];

    case 'CASE_STATUS':
      return isHi
        ? [
            'CNR नंबर क्या होता है और यह कहां मिलता है?',
            'eCourts मोबाइल ऐप कैसे डाउनलोड करें?'
          ]
        : [
            'What is a CNR number and where can I find it?',
            'How do I download the eCourts mobile app?'
          ];

    case 'LIVE_STREAMING':
      return isHi
        ? [
            'हाई कोर्ट लाइव स्ट्रीमिंग के नियम क्या हैं?',
            'न्याय विभाग की अन्य डिजिटल पहल क्या हैं?'
          ]
        : [
            'What are the rules regarding live streaming?',
            'What other digital initiatives exist under eCourts?'
          ];

    default:
      return isHi
        ? [
            'उच्च न्यायालयों में न्यायाधीशों की कितनी रिक्तियां हैं?',
            'NJDG पर कुल कितने केस लंबित हैं?',
            'वर्चुअल कोर्ट से ट्रैफिक चालान का भुगतान कैसे करें?',
            'टेली-लॉ के माध्यम से मुफ्त कानूनी सहायता कैसे लें?'
          ]
        : [
            'What are the current judge vacancies in High Courts?',
            'What is the case pendency on NJDG?',
            'How do I pay a traffic fine on Virtual Courts?',
            'How does Tele-Law legal aid work?'
          ];
  }
}

/**
 * Attaches structured official data cards based on query intent
 */
async function resolveDataCard(intent, userQuery, language, cnrMatch) {
  try {
    switch (intent) {
      case 'JUDGES_AND_VACANCIES': {
        const summary = await judgeService.getSummary();
        return {
          type: 'JUDGE_VACANCY',
          title: language === 'hi' ? 'न्यायाधीश रिक्ति एवं स्वीकृत पद विवरण' : 'Judge Vacancy & Strength Overview',
          data: summary
        };
      }

      case 'NJDG_PENDENCY': {
        const overview = await njdgService.getOverview();
        return {
          type: 'NJDG_STATS',
          title: language === 'hi' ? 'राष्ट्रीय न्यायिक डेटा ग्रिड (NJDG) सांख्यिकी' : 'National Judicial Data Grid (NJDG) Statistics',
          data: overview
        };
      }

      case 'TRAFFIC_FINES': {
        const guide = eCourtsService.getVirtualCourtGuide(language);
        return {
          type: 'PROCEDURAL_GUIDE',
          title: guide.title,
          data: guide
        };
      }

      case 'EFILING_EPAY': {
        const guide = eCourtsService.getEFilingGuide(language);
        return {
          type: 'PROCEDURAL_GUIDE',
          title: guide.title,
          data: guide
        };
      }

      case 'TELE_LAW': {
        const info = eCourtsService.getTeleLawInfo(language);
        return {
          type: 'TELE_LAW_INFO',
          title: info.title,
          data: info
        };
      }

      case 'FAST_TRACK_COURTS': {
        const info = eCourtsService.getFTSCInfo(language);
        return {
          type: 'PROCEDURAL_GUIDE',
          title: info.title,
          data: info
        };
      }

      case 'LIVE_STREAMING': {
        const info = eCourtsService.getLiveStreamingInfo(language);
        return {
          type: 'PROCEDURAL_GUIDE',
          title: info.title,
          data: info
        };
      }

      case 'ECOURTS_APP': {
        const info = eCourtsService.getMobileAppInfo(language);
        return {
          type: 'PROCEDURAL_GUIDE',
          title: info.title,
          data: info
        };
      }

      case 'CASE_STATUS': {
        const cnr = cnrMatch || userQuery.match(/[A-Za-z]{4}\d{12}/)?.[0];
        const parsed = cnr ? eCourtsService.validateAndParseCNR(cnr) : null;
        return {
          type: 'CASE_STATUS',
          title: language === 'hi' ? 'केस स्टेटस एवं सीएनआर (CNR) जानकारी' : 'Case Status & CNR Lookup Information',
          data: parsed || {
            cnrFormat: '16-Character Alphanumeric (e.g. DLHC010012342023)',
            officialPortalUrl: 'https://services.ecourts.gov.in'
          }
        };
      }

      default:
        return null;
    }
  } catch (err) {
    console.warn('[resolveDataCard Error]:', err.message);
    return null;
  }
}

/**
 * Primary Conversational Chat Handler
 * Endpoint: POST /api/chat
 */
export async function handleChatMessage(req, res, next) {
  const startTime = Date.now();

  try {
    // 1. Validate request body presence
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Request body must be a valid JSON object.'
        },
        timestamp: new Date().toISOString()
      });
    }

    // 2. Extract and sanitize message/query
    const rawMessage = req.body.query ?? req.body.message;

    if (rawMessage === undefined || rawMessage === null) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'The "message" or "query" field is required.'
        },
        timestamp: new Date().toISOString()
      });
    }

    if (typeof rawMessage !== 'string' || rawMessage.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'The query must be a non-empty string.'
        },
        timestamp: new Date().toISOString()
      });
    }

    if (rawMessage.length > 2000) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MESSAGE_TOO_LONG',
          message: 'Message length exceeds the maximum permitted limit of 2000 characters.'
        },
        timestamp: new Date().toISOString()
      });
    }

    // Sanitize control characters (except newline, carriage return, tab)
    const sanitizedQuery = rawMessage.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();

    // 3. Resolve session ID & options
    const { sessionId, language, topK } = req.body;
    let currentSessionId = sessionId;
    if (currentSessionId && (typeof currentSessionId !== 'string' || currentSessionId.length > 100)) {
      currentSessionId = randomUUID();
    }
    if (!currentSessionId) {
      currentSessionId = randomUUID();
    }

    const requestedTopK = Math.max(1, Math.min(parseInt(topK, 10) || 3, 10));

    // 4. Resolve language ('hi' if explicitly requested or Devanagari script detected)
    const isHindi = language === 'hi' || /[\u0900-\u097F]/.test(sanitizedQuery);
    const resolvedLanguage = isHindi ? 'hi' : 'en';

    // 5. Query Nitin's AI / RAG module via aiBridgeService with timeout protection
    let aiResponse;
    try {
      aiResponse = await queryJusticeAI(
        sanitizedQuery,
        resolvedLanguage,
        currentSessionId,
        {
          topK: requestedTopK,
          timeoutMs: config.aiTimeoutMs || 15000
        }
      );
    } catch (aiError) {
      console.error('[chatController AI Query Error]:', aiError.message);

      if (aiError.code === 'AI_TIMEOUT') {
        return res.status(504).json({
          success: false,
          error: {
            code: 'REQUEST_TIMEOUT',
            message: 'The AI service timed out while processing your request. Please try again shortly.'
          },
          timestamp: new Date().toISOString()
        });
      }

      // Graceful fallback for unexpected AI errors
      aiResponse = {
        answer: resolvedLanguage === 'hi'
          ? 'न्याय विभाग डिजिटल सहायक वर्तमान में अनुरोध को संसाधित करने में असमर्थ है। कृपया सीधे आधिकारिक पोर्टल doj.gov.in पर जाएँ या कुछ समय बाद पुनः प्रयास करें।'
          : 'The JusticeAI virtual assistant is momentarily unable to process this request. Please consult the official portal at doj.gov.in or try again shortly.',
        language: resolvedLanguage,
        intent: 'OUT_OF_SCOPE',
        sources: [
          {
            title: 'Department of Justice — Official Portal',
            label: 'Department of Justice — Official Portal',
            url: 'https://doj.gov.in',
            category: 'Official Portal',
            snippet: 'Department of Justice official government reference.'
          }
        ],
        citations: [
          {
            sourceTitle: 'Department of Justice — Official Portal',
            url: 'https://doj.gov.in',
            snippet: 'Department of Justice official government reference.',
            category: 'Official Portal'
          }
        ],
        dataStatus: 'official_reference',
        dataFreshness: OFFICIAL_DATA_FRESHNESS,
        lastChecked: new Date().toISOString().split('T')[0],
        cnr: null,
        metadata: {
          modelUsed: 'system-error-fallback',
          isLiveModel: false
        }
      };
    }

    // 6. Enrich with structured official DataCards
    const dataCard = await resolveDataCard(
      aiResponse.intent,
      sanitizedQuery,
      resolvedLanguage,
      aiResponse.cnr
    );

    // 7. Normalize sources and citations for both Frontend and API contract compatibility
    const normalizedSources = (aiResponse.sources || []).map((s) => ({
      title: s.title || s.label || 'Department of Justice',
      label: s.label || s.title || 'Department of Justice',
      url: s.url || 'https://doj.gov.in',
      category: s.category || 'Official Reference',
      snippet: s.snippet || s.title || '',
      relevanceScore: s.relevanceScore !== undefined ? s.relevanceScore : 1.0
    }));

    const normalizedCitations = (aiResponse.citations || []).map((c) => ({
      sourceTitle: c.sourceTitle || c.title || 'Department of Justice',
      url: c.url || 'https://doj.gov.in',
      snippet: c.snippet || c.sourceTitle || '',
      category: c.category || 'Official Reference'
    }));

    // 8. Generate contextual suggested follow-up questions
    const suggestedQuestions = getSuggestedQuestions(aiResponse.intent, resolvedLanguage);

    const durationMs = Date.now() - startTime;

    // 9. Return standardized, rich JSON response
    return res.status(200).json({
      success: true,
      sessionId: currentSessionId,
      reply: aiResponse.answer,
      answer: aiResponse.answer,
      language: resolvedLanguage,
      intent: aiResponse.intent || 'GENERAL_DOJ_QUERY',
      isLive: aiResponse.metadata?.isLiveModel ?? true,
      dataStatus: aiResponse.dataStatus || 'official_reference',
      dataFreshness: aiResponse.dataFreshness || OFFICIAL_DATA_FRESHNESS,
      lastChecked: aiResponse.lastChecked || OFFICIAL_DATA_FRESHNESS.lastUpdated,
      dataCard: dataCard,
      sources: normalizedSources,
      citations: normalizedCitations,
      suggestedQuestions: suggestedQuestions,
      retrieval: {
        chunksRetrieved: aiResponse.metadata?.chunksRetrieved ?? normalizedSources.length,
        topK: requestedTopK,
        isRetrievedFromKnowledgeBase: normalizedSources.length > 0
      },
      metadata: aiResponse.metadata || {
        durationMs
      },
      responseTimeMs: durationMs,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}

export default {
  handleChatMessage
};
