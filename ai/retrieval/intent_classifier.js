/**
 * JusticeAI Question Understanding & Intent Classifier
 * Developer: Nitin (AI / RAG Developer)
 * Sprint: Day 2 — Core Chatbot Intelligence
 * 
 * Analyzes citizen queries:
 * 1. Detects language (English, Devanagari Hindi, or Transliterated Hinglish).
 * 2. Classifies primary intent across the 10 DoJ categories + Guardrails + Out-of-Scope.
 * 3. Extracts judicial entities (e.g., 16-character CNR number, court tiers, states).
 */

const INTENTS = {
  CASE_STATUS: 'CASE_STATUS',
  JUDGES_AND_VACANCIES: 'JUDGES_AND_VACANCIES',
  NJDG_PENDENCY: 'NJDG_PENDENCY',
  TRAFFIC_FINES: 'TRAFFIC_FINES',
  LIVE_STREAMING: 'LIVE_STREAMING',
  EFILING_EPAY: 'EFILING_EPAY',
  FAST_TRACK_COURTS: 'FAST_TRACK_COURTS',
  ECOURTS_APP: 'ECOURTS_APP',
  TELE_LAW: 'TELE_LAW',
  DOJ_ADMIN: 'DOJ_ADMIN',
  LEGAL_ADVICE_PROHIBITED: 'LEGAL_ADVICE_PROHIBITED',
  OUT_OF_SCOPE: 'OUT_OF_SCOPE',
  GREETING: 'GREETING',
};

// Keyword and regex rules for intent matching
const INTENT_PATTERNS = [
  {
    intent: INTENTS.LEGAL_ADVICE_PROHIBITED,
    regex: /(will i win|who will win|guarantee.*win|secret verdict|can you defeat|legal advice on my.*case|पक्का जीतूंगा|फैसला किसके पक्ष|जीतने की गारंटी|गोपनीय फैसला|गोपनीय फैसले|कौन जीतेगा|किसकी जीत)/i,
  },
  {
    intent: INTENTS.GREETING,
    regex: /^(hi|hello|hey|namaste|pranam|namaskar|good morning|good afternoon|good evening|नमस्ते|प्रणाम|नमस्कार|hello justiceai)$/i,
  },
  {
    intent: INTENTS.CASE_STATUS,
    regex: /(case status|cnr|cause list|hearing date|next date|court order|case number|peshi|tarikh|case check|case tracking|order sheet|judgement download|केस की स्थिति|मुकदमे की तारीख|सीएनआर|कॉज लिस्ट|केस स्टेटस|अदालती आदेश|पेशी की तारीख|तारीख कब है|केस नंबर से स्थिति)/i,
  },
  {
    intent: INTENTS.JUDGES_AND_VACANCIES,
    regex: /(judge|judges|vacancy|vacancies|sanctioned strength|working strength|collegium|appointment of judges|cji|chief justice|mop|memorandum of procedure|न्यायाधीश|जज|रिक्तियां|स्वीकृत पद|कॉलेजियम|नियुक्ति|हाई कोर्ट जज|सुप्रीम कोर्ट जज)/i,
  },
  {
    intent: INTENTS.NJDG_PENDENCY,
    regex: /(njdg|pendency|pending cases|disposal rate|disposed cases|national judicial data grid|case statistics|case backlog|how many cases pending|लंबित मामले|लंबित केस|एनजेडीजी|लंबित मुकदमे|निस्तारण दर|कितने केस पेंडिंग|न्यायिक डेटा)/i,
  },
  {
    intent: INTENTS.TRAFFIC_FINES,
    regex: /(traffic|challan|virtual court|vcourt|vcourts|parivahan|traffic fine|motor vehicle|plead guilty|contest challan|fine payment|challan kaise bhare|challan status|ट्रैफिक|चालान|वर्चुअल कोर्ट|ई-चालान|यातायात जुर्माना|चालान भुगतान|जुर्माना कैसे भरें)/i,
  },
  {
    intent: INTENTS.LIVE_STREAMING,
    regex: /(live stream|streaming|watch court|broadcast|swapnil tripathi|live hearing|court proceeding live|stream sci|youtube court|लाइव प्रसारण|स्ट्रीमिंग|अदालत की सुनवाई|लाइव देखें|अदालत की लाइव कार्यवाही)/i,
  },
  {
    intent: INTENTS.EFILING_EPAY,
    regex: /(efiling|e-filing|epay|e-pay|court fee|online filing|judicial stamp|vakalatnama|electronic court fee|pay ecourts|efiling 3\.0|ई-फाइलिंग|ई-पे|कोर्ट फीस|ऑनलाइन फाइलिंग|स्टाम्प शुल्क|कोर्ट फीस भुगतान)/i,
  },
  {
    intent: INTENTS.FAST_TRACK_COURTS,
    regex: /(fast track|ftsc|pocso|nirbhaya|rape case|special court|vulnerable witness|1 year trial|फास्ट ट्रैक|पॉक्सो|निर्भया|विशेष अदालत|यौन अपराध|शीघ्र न्याय)/i,
  },
  {
    intent: INTENTS.ECOURTS_APP,
    regex: /(ecourts app|mobile app|download app|services app|play store|app store|qr code case|case diary|my cases|मोबाइल ऐप|ई-कोर्ट्स ऐप|ऐप डाउनलोड|ई-कोर्ट्स सर्विसेज मोबाइल ऐप)/i,
  },
  {
    intent: INTENTS.TELE_LAW,
    regex: /(tele-law|telelaw|free legal|legal aid|csc|panel lawyer|marginalized|disha scheme|nyaya bandhu|pro bono|section 12|muft vakil|muft kanuni salah|टेली-लॉ|टेली लॉ|निःशुल्क कानूनी|विधिक सहायता|पैनल वकील|सीएससी|दिशा योजना|न्याय बंधु)/i,
  },
  {
    intent: INTENTS.DOJ_ADMIN,
    regex: /(department of justice|doj|ministry of law|divisions|mandate|infrastructure scheme|citizen charter|icjs|jaisalmer house|allocation of business|न्याय विभाग|विधि मंत्रालय|प्रभाग|कार्यप्रणाली|नागरिक चार्टर)/i,
  },
];

// Keywords clearly outside DoJ boundary
const OUT_OF_SCOPE_PATTERNS = [
  /(weather|forecast|temperature|recipe|cricket score|movie|bollywood|restaurant|hotel booking|flight ticket|crypto|bitcoin|joke|biryani|मौसम|क्रिकेट|मूवी|खाना बनाने की विधि|रेसिपी|बिरयानी|गाना)/i,
];

/**
 * Detect language of query: 'hi' (Devanagari), 'hi-Latn' (Hinglish), or 'en' (English)
 * @param {string} text Input query
 * @returns {'en' | 'hi' | 'hi-Latn'}
 */
function detectLanguage(text) {
  if (!text || typeof text !== 'string') return 'en';

  // Devanagari Unicode block (\u0900 - \u097F)
  const devanagariCount = (text.match(/[\u0900-\u097F]/g) || []).length;
  if (devanagariCount > 2) {
    return 'hi';
  }

  // Common Hinglish markers
  const hinglishMarkers = /\b(kaise|kya|kyu|kab|kaha|kare|dekhe|mera|apna|batao|chahiye|hoga|hai|ho|nahi|karna|madad)\b/i;
  if (hinglishMarkers.test(text)) {
    return 'hi-Latn';
  }

  return 'en';
}

/**
 * Extracts 16-character alphanumeric CNR number if present
 * Standard format: 4 letters + 2 digits + 6 digits + 4 digits (e.g., DLHC010012342023)
 * @param {string} text Input text
 * @returns {string | null}
 */
function extractCNR(text) {
  const cnrMatch = text.match(/\b([A-Za-z]{4}\d{12})\b/);
  return cnrMatch ? cnrMatch[1].toUpperCase() : null;
}

/**
 * Classifies query intent and extracts judicial entities
 * @param {string} query Citizen's question
 * @returns {{
 *   intent: string,
 *   detectedLang: 'en' | 'hi' | 'hi-Latn',
 *   cnr: string | null,
 *   isDoJRelevant: boolean,
 *   confidence: number
 * }}
 */
function analyzeQuery(query) {
  if (!query || typeof query !== 'string') {
    return {
      intent: INTENTS.OUT_OF_SCOPE,
      detectedLang: 'en',
      cnr: null,
      isDoJRelevant: false,
      confidence: 0,
    };
  }

  const trimmed = query.trim();
  const detectedLang = detectLanguage(trimmed);
  const cnr = extractCNR(trimmed);

  // If a valid CNR number is detected, immediately prioritize CASE_STATUS
  if (cnr) {
    return {
      intent: INTENTS.CASE_STATUS,
      detectedLang,
      cnr,
      isDoJRelevant: true,
      confidence: 0.98,
    };
  }

  // Check for out-of-scope queries
  for (const pattern of OUT_OF_SCOPE_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        intent: INTENTS.OUT_OF_SCOPE,
        detectedLang,
        cnr: null,
        isDoJRelevant: false,
        confidence: 0.95,
      };
    }
  }

  // Check intent patterns
  for (const { intent, regex } of INTENT_PATTERNS) {
    if (regex.test(trimmed)) {
      return {
        intent,
        detectedLang,
        cnr: null,
        isDoJRelevant: intent !== INTENTS.OUT_OF_SCOPE,
        confidence: 0.9,
      };
    }
  }

  // General DoJ inquiry by default if it passes basic checks
  return {
    intent: INTENTS.DOJ_ADMIN,
    detectedLang,
    cnr: null,
    isDoJRelevant: true,
    confidence: 0.6,
  };
}

module.exports = {
  INTENTS,
  analyzeQuery,
  detectLanguage,
  extractCNR,
};
