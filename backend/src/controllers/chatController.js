import { randomUUID } from 'crypto';
import { judgeService } from '../services/judgeService.js';
import { njdgService } from '../services/njdgService.js';
import { eCourtsService } from '../services/eCourtsService.js';

export async function handleChatMessage(req, res, next) {
  const startTime = Date.now();

  try {
    const { message, sessionId, language = 'en' } = req.body;

    // Validation
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'The "message" field is required and must be a non-empty string.'
        },
        timestamp: new Date().toISOString()
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MESSAGE_TOO_LONG',
          message: 'Message length exceeds the maximum limit of 2000 characters.'
        },
        timestamp: new Date().toISOString()
      });
    }

    const currentSessionId = sessionId || randomUUID();
    const query = message.trim().toLowerCase();
    const isHindi = language === 'hi' || /[\u0900-\u097F]/.test(message);
    const resolvedLang = isHindi ? 'hi' : 'en';

    let intent = 'GENERAL_DOJ_QUERY';
    let reply = '';
    let dataCard = null;
    let citations = [];
    let suggestedQuestions = [];

    // Intent 1: Judge Appointments & Vacancies
    if (
      query.includes('judge') ||
      query.includes('vacanc') ||
      query.includes('sanctioned') ||
      query.includes('न्यायाधीश') ||
      query.includes('रिक्ति') ||
      query.includes('पद')
    ) {
      intent = 'JUDGE_VACANCIES';
      const result = await judgeService.getFormattedResponse(resolvedLang);
      reply = result.reply;
      dataCard = result.dataCard;
      citations = result.citations;
      suggestedQuestions = isHindi
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
    }
    // Intent 2: National Judicial Data Grid (NJDG) Statistics
    else if (
      query.includes('njdg') ||
      query.includes('pendency') ||
      query.includes('pending') ||
      query.includes('लंबित') ||
      query.includes('मुकदमे') ||
      query.includes('आंकड़े')
    ) {
      intent = 'NJDG_STATISTICS';
      const result = await njdgService.getFormattedResponse(resolvedLang);
      reply = result.reply;
      dataCard = result.dataCard;
      citations = result.citations;
      suggestedQuestions = isHindi
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
    }
    // Intent 3: Traffic Violation & Virtual Courts
    else if (
      query.includes('traffic') ||
      query.includes('challan') ||
      query.includes('virtual court') ||
      query.includes('चालान') ||
      query.includes('ट्रैफिक') ||
      query.includes('जुर्माना')
    ) {
      intent = 'VIRTUAL_COURTS_PROCEDURE';
      const guide = eCourtsService.getVirtualCourtGuide(resolvedLang);
      dataCard = {
        type: 'PROCEDURAL_GUIDE',
        title: guide.title,
        data: guide
      };
      citations = [
        {
          sourceTitle: 'Virtual Courts Official Portal',
          url: 'https://vcourts.gov.in',
          snippet: 'Virtual Courts is an initiative of the eCourts project to eliminate the presence of litigants in court for petty offences.'
        }
      ];

      if (isHindi) {
        reply = `वर्चुअल कोर्ट (Virtual Court) के माध्यम से ट्रैफिक चालान का निपटारा करने के चरण:\n\n` +
          guide.steps.map((s, idx) => `${idx + 1}. ${s}`).join('\n') +
          `\n\nआधिकारिक पोर्टल: vcourts.gov.in`;
        suggestedQuestions = [
          'अगर मैं चालान को कोर्ट में चुनौती देना चाहता हूं तो क्या होगा?',
          'ई-कोर्ट्स पोर्टल पर केस का स्टेटस कैसे चेक करें?',
          'टेली-लॉ योजना क्या है?'
        ];
      } else {
        reply = `Here is the step-by-step procedure to resolve and pay a traffic violation fine through Virtual Courts:\n\n` +
          guide.steps.map((s, idx) => `${idx + 1}. ${s}`).join('\n') +
          `\n\nOfficial Portal: https://vcourts.gov.in`;
        suggestedQuestions = [
          'Can I contest a traffic challan in a regular court?',
          'How do I check case status using a CNR number?',
          'What are the judicial statistics on the NJDG portal?'
        ];
      }
    }
    // Intent 4: eFiling & ePay
    else if (
      query.includes('efiling') ||
      query.includes('e-filing') ||
      query.includes('epay') ||
      query.includes('e-pay') ||
      query.includes('ई-फाइलिंग') ||
      query.includes('कोर्ट फीस')
    ) {
      intent = 'EFILING_EPAY_GUIDANCE';
      const guide = eCourtsService.getEFilingGuide(resolvedLang);
      dataCard = {
        type: 'PROCEDURAL_GUIDE',
        title: guide.title,
        data: guide
      };
      citations = [
        {
          sourceTitle: 'eCourts eFiling 3.0 User Manual',
          url: 'https://efiling.ecourts.gov.in',
          snippet: 'eFiling system enables electronic filing of cases for High Courts and Subordinate Courts across India.'
        }
      ];

      if (isHindi) {
        reply = `ई-फाइलिंग 3.0 और ई-पे (ePay) के माध्यम से केस और कोर्ट फीस दर्ज करने के चरण:\n\n` +
          guide.steps.map((s, idx) => `${idx + 1}. ${s}`).join('\n');
        suggestedQuestions = [
          'ePay पोर्टल पर भुगतान के कौन से विकल्प उपलब्ध हैं?',
          'eCourts Services मोबाइल ऐप का उपयोग कैसे करें?',
          'फास्ट ट्रैक विशेष न्यायालय (FTSC) क्या हैं?'
        ];
      } else {
        reply = `Step-by-step guidance for eFiling 3.0 and online court fee payment (ePay):\n\n` +
          guide.steps.map((s, idx) => `${idx + 1}. ${s}`).join('\n');
        suggestedQuestions = [
          'What payment methods are supported on ePay?',
          'How do I register on the eCourts mobile app?',
          'What is the Fast Track Special Courts (FTSC) scheme?'
        ];
      }
    }
    // Intent 5: Tele-Law Services
    else if (
      query.includes('tele-law') ||
      query.includes('tele law') ||
      query.includes('legal aid') ||
      query.includes('कानूनी सहायता') ||
      query.includes('टेली-लॉ')
    ) {
      intent = 'TELE_LAW_INFO';
      const info = eCourtsService.getTeleLawInfo(resolvedLang);
      dataCard = {
        type: 'TELE_LAW_INFO',
        title: info.title,
        data: info
      };
      citations = [
        {
          sourceTitle: 'Tele-Law: Reaching the Unreached - Department of Justice',
          url: 'https://www.tele-law.in',
          snippet: 'Tele-Law leverages technology to facilitate delivery of legal advice through a panel of lawyers stationed at State Legal Services Authorities.'
        }
      ];

      if (isHindi) {
        reply = `**${info.title}**\n\n` +
          `${info.summary}\n\n` +
          `• **पात्रता**: ${info.eligibility}\n` +
          `• **हेल्पलाइन**: ${info.helpline}\n` +
          `• **आधिकारिक पोर्टल**: ${info.officialUrl}`;
        suggestedQuestions = [
          'कॉमन सर्विस सेंटर (CSC) पर टेली-लॉ की सुविधा कैसे लें?',
          'क्या टेली-लॉ परामर्श पूरी तरह मुफ्त है?',
          'न्याय विभाग के प्रमुख प्रभाग (Divisions) कौन से हैं?'
        ];
      } else {
        reply = `**${info.title}**\n\n` +
          `${info.summary}\n\n` +
          `• **Eligibility for Free Consultation**: ${info.eligibility}\n` +
          `• **National Toll-Free Helpline**: ${info.helpline}\n` +
          `• **Official Portal**: ${info.officialUrl}`;
        suggestedQuestions = [
          'How can I find the nearest Common Service Centre (CSC)?',
          'Is legal representation covered under Tele-Law?',
          'What are the key divisions of the Department of Justice?'
        ];
      }
    }
    // Intent 6: Fast Track Special Courts (FTSC)
    else if (
      query.includes('ftsc') ||
      query.includes('fast track') ||
      query.includes('pocso') ||
      query.includes('फास्ट ट्रैक') ||
      query.includes('पॉक्सो')
    ) {
      intent = 'FTSC_SCHEME';
      const info = eCourtsService.getFTSCInfo(resolvedLang);
      dataCard = {
        type: 'PROCEDURAL_GUIDE',
        title: info.title,
        data: info
      };
      citations = [
        {
          sourceTitle: 'Department of Justice - Fast Track Special Courts Scheme',
          url: 'https://doj.gov.in/fast-track-special-court-ftsc/',
          snippet: 'Centrally sponsored scheme for setting up Fast Track Special Courts for quick disposal of cases under POCSO Act.'
        }
      ];

      if (isHindi) {
        reply = `**${info.title}**\n\n` +
          `${info.summary}\n\n` +
          `• **सक्रिय अदालतें**: ${info.operationalCount}\n` +
          `• **समयसीमा**: ${info.mandate}`;
        suggestedQuestions = [
          'NJDG पर POCSO मामलों की पेंडेंसी कैसे देखें?',
          'न्याय विभाग के अंतर्गत अन्य कौन सी योजनाएं संचालित हैं?'
        ];
      } else {
        reply = `**${info.title}**\n\n` +
          `${info.summary}\n\n` +
          `• **Operational Strength**: ${info.operationalCount}\n` +
          `• **Mandate**: ${info.mandate}`;
        suggestedQuestions = [
          'How do I view POCSO pendency statistics on NJDG?',
          'What are the other major schemes of the Department of Justice?'
        ];
      }
    }
    // Intent 7: Case Status & CNR Lookup
    else if (
      query.includes('cnr') ||
      query.includes('case status') ||
      query.includes('केस स्टेटस') ||
      /[A-Z]{4}\d{12}/i.test(query)
    ) {
      intent = 'CASE_STATUS_LOOKUP';
      const cnrMatch = message.match(/[A-Za-z]{4}\d{12}/);
      const parsed = cnrMatch ? eCourtsService.validateAndParseCNR(cnrMatch[0]) : null;

      dataCard = {
        type: 'CASE_STATUS',
        title: isHindi ? 'केस स्टेटस एवं सीएनआर (CNR) जानकारी' : 'Case Status & CNR Lookup Information',
        data: parsed || {
          cnrFormat: '16-Character Alphanumeric (e.g. DLHC010012342023)',
          officialPortalUrl: 'https://services.ecourts.gov.in'
        }
      };

      citations = [
        {
          sourceTitle: 'eCourts Services Official Case Status Portal',
          url: 'https://services.ecourts.gov.in/ecourtindia_v6/?p=casestatus',
          snippet: 'Search case status by CNR number, case number, filing number, party name, or advocate name.'
        }
      ];

      if (parsed && parsed.isValid) {
        reply = isHindi
          ? `आपका CNR संख्या **${parsed.cnr}** मान्य प्रारूप में है:\n- राज्य कोड: ${parsed.parsed.stateCode}\n- न्यायालय कोड: ${parsed.parsed.courtCode}\n- केस संख्या: ${parsed.parsed.caseNumber}\n- फाइलिंग वर्ष: ${parsed.parsed.filingYear}\n\n⚠️ **महत्वपूर्ण सूचना**: आधिकारिक eCourts पोर्टल पर वास्तविक समय (Live) केस विवरण देखने के लिए सुरक्षा कैप्चा (CAPTCHA) आवश्यक है। कृपया नीचे दिए गए आधिकारिक पोर्टल लिंक पर सीधे पुष्टि करें।`
          : `Your CNR Number **${parsed.cnr}** has been validated successfully:\n- State Code: ${parsed.parsed.stateCode}\n- Court Code: ${parsed.parsed.courtCode}\n- Case Number: ${parsed.parsed.caseNumber}\n- Filing Year: ${parsed.parsed.filingYear}\n\n⚠️ **Official Notice**: Direct live case lookups on the eCourts Services portal require CAPTCHA verification to protect citizen privacy. Please click below to proceed directly to the verified official portal.`;
      } else {
        reply = isHindi
          ? `केस की स्थिति (Case Status) जानने के लिए 16 अंकों का CNR नंबर आवश्यक है (उदाहरण: DLHC010012342023)।\n\nयदि आपके पास CNR नंबर नहीं है, तो आप eCourts Services पोर्टल पर केस नंबर, पार्टी का नाम या वकील के नाम से भी खोज सकते हैं।`
          : `To track your case status, you can use your 16-character alphanumeric CNR number (e.g., DLHC010012342023).\n\nIf you do not have a CNR number, you can also search on the official eCourts Services portal using Case Number, Party Name, or Advocate Name.`;
      }

      suggestedQuestions = isHindi
        ? ['CNR नंबर क्या होता है और यह कहां मिलता है?', 'eCourts मोबाइल ऐप कैसे डाउनलोड करें?']
        : ['What is a CNR number and where can I find it?', 'How do I download the eCourts mobile app?'];
    }
    // Intent 8: Live Streaming of Court Proceedings
    else if (
      query.includes('live stream') ||
      query.includes('streaming') ||
      query.includes('सीधा प्रसारण') ||
      query.includes('प्रसारण')
    ) {
      intent = 'LIVE_STREAMING_INFO';
      const liveInfo = eCourtsService.getLiveStreamingInfo(resolvedLang);
      dataCard = {
        type: 'PROCEDURAL_GUIDE',
        title: liveInfo.title,
        data: liveInfo
      };
      citations = [
        {
          sourceTitle: 'Supreme Court of India Webcast Portal',
          url: 'https://webcast.gov.in/scindia',
          snippet: 'Official live streaming webcast portal for Constitution Bench hearings of the Supreme Court of India.'
        }
      ];

      reply = isHindi
        ? `**न्यायालयी कार्यवाही का सीधा प्रसारण (Live Streaming)**:\n\n` +
          `सर्वोच्च न्यायालय की संविधान पीठों की सुनवाई आधिकारिक वेबकास्ट (webcast.gov.in/scindia) पर प्रसारित की जाती है।\n` +
          `इसके अतिरिक्त गुजरात, कर्नाटक, उड़ीसा, मध्य प्रदेश और पटना उच्च न्यायालय अपनी कार्यवाही का यूट्यूब चैनलों पर सीधा प्रसारण करते हैं।\n\n` +
          `⚠️ ${liveInfo.rulesNotice}`
        : `**Live Streaming of Court Proceedings**:\n\n` +
          `Constitution Bench proceedings of the Supreme Court of India are live-streamed at webcast.gov.in/scindia.\n` +
          `Additionally, High Courts of Gujarat, Karnataka, Orissa, Madhya Pradesh, and Patna live-stream court proceedings via verified YouTube channels.\n\n` +
          `⚠️ ${liveInfo.rulesNotice}`;

      suggestedQuestions = isHindi
        ? ['हाई कोर्ट लाइव स्ट्रीमिंग के नियम क्या हैं?', 'न्याय विभाग की अन्य डिजिटल पहल क्या हैं?']
        : ['What are the rules regarding live streaming?', 'What other digital initiatives exist under eCourts?'];
    }
    // Intent 9: Default / General Guidance
    else {
      intent = 'GENERAL_DOJ_GUIDANCE';
      citations = [
        {
          sourceTitle: 'Department of Justice - Official Portal',
          url: 'https://doj.gov.in',
          snippet: 'Official portal of Department of Justice, Ministry of Law and Justice, Government of India.'
        }
      ];

      if (isHindi) {
        reply = `नमस्ते! मैं **JusticeAI** हूँ — न्याय विभाग, विधि एवं न्याय मंत्रालय, भारत सरकार का आधिकारिक डिजिटल सहायक।\n\n` +
          `मैं आपकी निम्नलिखित सेवाओं में सहायता कर सकता हूँ:\n` +
          `1. **न्यायाधीश पद एवं रिक्तियां**: सर्वोच्च न्यायालय एवं उच्च न्यायालयों में स्वीकृत पद एवं रिक्तियां।\n` +
          `2. **राष्ट्रीय न्यायिक डेटा ग्रिड (NJDG)**: देश भर के न्यायालयों में केस पेंडेंसी सांख्यिकी।\n` +
          `3. **वर्चुअल कोर्ट एवं ट्रैफिक चालान**: ऑनलाइन चालान देखने और भुगतान करने की प्रक्रिया।\n` +
          `4. **ई-फाइलिंग और ई-पे**: केस ऑनलाइन दर्ज करने और कोर्ट फीस भुगतान की मार्गदर्शिका।\n` +
          `5. **टेली-लॉ**: ग्रामीण और वंचित नागरिकों के लिए मुफ्त कानूनी सलाह सेवा (हेल्पलाइन: 14416)।\n` +
          `6. **फास्ट ट्रैक विशेष न्यायालय (FTSC)**: बलात्कार और पॉक्सो मामलों के त्वरित निपटारे की जानकारी।\n\n` +
          `आप किस विषय में जानकारी चाहते हैं?`;
        suggestedQuestions = [
          'उच्च न्यायालयों में न्यायाधीशों की कितनी रिक्तियां हैं?',
          'NJDG पर कुल कितने केस लंबित हैं?',
          'वर्चुअल कोर्ट से ट्रैफिक चालान का भुगतान कैसे करें?',
          'टेली-लॉ के माध्यम से मुफ्त कानूनी सहायता कैसे लें?'
        ];
      } else {
        reply = `Hello! I am **JusticeAI**, the official digital justice assistant for the Department of Justice, Ministry of Law & Justice, Government of India.\n\n` +
          `I can assist you with:\n` +
          `1. **Judge Strengths & Vacancies**: Sanctioned counts and current vacancies across Supreme Court & 25 High Courts.\n` +
          `2. **NJDG Pendency Statistics**: Real-time aggregate pendency figures across Indian courts.\n` +
          `3. **Virtual Courts & Traffic Challans**: Step-by-step guidance to settle and pay traffic violation fines online.\n` +
          `4. **eFiling 3.0 & ePay**: Filing procedures, digital signatures, and electronic court fees.\n` +
          `5. **Tele-Law Legal Aid**: Accessing free pre-litigation legal advice via CSCs and helpline 14416.\n` +
          `6. **Fast Track Special Courts (FTSCs)**: Special courts for expeditious POCSO and sexual offence trials.\n` +
          `7. **eCourts Mobile App**: Features, CNR lookup, and download links.\n\n` +
          `How may I assist you today?`;
        suggestedQuestions = [
          'What are the current judge vacancies in High Courts?',
          'What is the case pendency on NJDG?',
          'How do I pay a traffic fine on Virtual Courts?',
          'How does Tele-Law legal aid work?'
        ];
      }
    }

    const durationMs = Date.now() - startTime;

    return res.status(200).json({
      success: true,
      sessionId: currentSessionId,
      reply,
      language: resolvedLang,
      intent,
      isLive: true,
      dataCard,
      citations,
      suggestedQuestions,
      responseTimeMs: durationMs,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}
