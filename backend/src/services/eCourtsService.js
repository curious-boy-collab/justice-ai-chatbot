/**
 * eCourts and Citizen Judicial Services Module
 * Covers: Virtual Courts, eFiling 3.0, ePay, Tele-Law, FTSC, Mobile App, CNR lookup, Live Streaming
 */

export const eCourtsService = {
  /**
   * Validates and parses a 16-character alphanumeric CNR number
   * Format: [State 2 chars][Court Code 2-4 chars][Case Number 6 digits][Year 4 digits]
   * Example: DLHC010012342023
   */
  validateAndParseCNR(cnr) {
    if (!cnr || typeof cnr !== 'string') {
      return { isValid: false, reason: 'CNR number is required.' };
    }

    const cleanCnr = cnr.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');

    if (cleanCnr.length !== 16) {
      return {
        isValid: false,
        cnr: cleanCnr,
        reason: `Invalid CNR length (${cleanCnr.length} chars). CNR must be exactly 16 alphanumeric characters.`
      };
    }

    const stateCode = cleanCnr.substring(0, 2);
    const courtCode = cleanCnr.substring(2, 6);
    const caseNumber = cleanCnr.substring(6, 12);
    const filingYear = cleanCnr.substring(12, 16);

    const yearNum = parseInt(filingYear, 10);
    const currentYear = new Date().getFullYear();
    if (isNaN(yearNum) || yearNum < 1950 || yearNum > currentYear + 1) {
      return {
        isValid: false,
        cnr: cleanCnr,
        reason: `Invalid filing year in CNR: ${filingYear}.`
      };
    }

    return {
      isValid: true,
      cnr: cleanCnr,
      parsed: {
        stateCode,
        courtCode,
        caseNumber,
        filingYear
      },
      officialPortalUrl: `https://services.ecourts.gov.in/ecourtindia_v6/?p=casestatus`
    };
  },

  /**
   * Procedural Guide: Virtual Courts Traffic Challan Payment
   */
  getVirtualCourtGuide(language = 'en') {
    if (language === 'hi') {
      return {
        title: 'वर्चुअल कोर्ट (Virtual Court) ई-चालान भुगतान प्रक्रिया',
        steps: [
          'आधिकारिक पोर्टल vcourts.gov.in पर जाएं।',
          'अपने राज्य और संबंधित विभाग (जैसे दिल्ली ट्रैफिक पुलिस) का चयन करें।',
          'मोबाइल नंबर, वाहन संख्या या चालान संख्या दर्ज कर अपना मामला खोजें।',
          'जुर्माने की राशि और उल्लंघन विवरण की जांच करें।',
          'यदि आप दोष स्वीकार करते हैं, तो "Plead Guilty" चुनें और ePay के माध्यम से ऑनलाइन भुगतान करें।',
          'यदि आप चुनौती देना चाहते हैं, तो मामले को नियमित अदालत में स्थानांतरित करने का विकल्प चुनें।'
        ],
        officialPortalUrl: 'https://vcourts.gov.in',
        helpline: '1800-11-0031'
      };
    }

    return {
      title: 'Virtual Court Traffic Violation Fine Payment Procedure',
      steps: [
        'Visit the official Virtual Courts portal at vcourts.gov.in.',
        'Select your State and Judicial Department (e.g., Delhi Traffic Court).',
        'Search your case using Mobile Number, Vehicle Number, or Challan Number.',
        'Review the alleged offense, compounding amount, and summons notice.',
        'Choose "Propose to Plead Guilty" to settle online or "Contest" to transfer the case to a regular magistrate.',
        'Make payment via the integrated ePay gateway (UPI, NetBanking, Debit Card) and download the court receipt.'
      ],
      officialPortalUrl: 'https://vcourts.gov.in',
      helpline: '1800-11-0031'
    };
  },

  /**
   * Procedural Guide: eFiling 3.0 & ePay Court Fees
   */
  getEFilingGuide(language = 'en') {
    if (language === 'hi') {
      return {
        title: 'ई-फाइलिंग 3.0 और ई-पे (eFiling & ePay) प्रक्रिया',
        steps: [
          'efiling.ecourts.gov.in पोर्टल पर अपने बार काउंसिल या लिटिगेंट क्रेडेंशियल्स से लॉग इन करें।',
          'केस विवरण, वादी-प्रतिवादी की जानकारी और याचिका अपलोड करें।',
          'दस्तावेजों को डिजिटल रूप से eSign या आधार eSign से सत्यापित करें।',
          'ePay पोर्टल (pay.ecourts.gov.in) पर जाकर कोर्ट फीस, जुडिशियल स्टांप और प्रोसेस फीस का भुगतान करें।',
          'अंतिम रूप से सबमिट करें और ई-फाइलिंग पावती (Acknowledgment Slip) डाउनलोड करें।'
        ],
        officialPortalUrl: 'https://efiling.ecourts.gov.in',
        payPortalUrl: 'https://pay.ecourts.gov.in'
      };
    }

    return {
      title: 'Step-by-Step Guidance for eFiling 3.0 & ePay',
      steps: [
        'Register/Log in on the unified eFiling 3.0 portal (efiling.ecourts.gov.in) with your Bar Council ID or litigant mobile OTP.',
        'Initiate "New Case" or "Interlocutory Application (IA)" and enter litigant/advocate details.',
        'Upload court pleadings, affidavits, and annexures in OCR-searchable PDF format.',
        'Digitally sign documents using eSign (Aadhaar OTP-based) or USB Token digital signature certificate (DSC).',
        'Redirect to ePay (pay.ecourts.gov.in) or State Treasury (Bharatkosh/SBI ePay) to remit required court fees.',
        'Submit for court scrutiny and track filing verification status via the generated acknowledgment number.'
      ],
      officialPortalUrl: 'https://efiling.ecourts.gov.in',
      payPortalUrl: 'https://pay.ecourts.gov.in'
    };
  },

  /**
   * Information on Tele-Law Services
   */
  getTeleLawInfo(language = 'en') {
    if (language === 'hi') {
      return {
        title: 'टेली-लॉ (Tele-Law) कानूनी सहायता सेवा',
        summary: 'टेली-लॉ न्याय विभाग और NALSA की एक पहल है जो कॉमन सर्विस सेंटर (CSC) और मोबाइल ऐप के माध्यम से पैनल वकीलों से मुफ्त पूर्व-मुकदमा कानूनी सलाह प्रदान करती है।',
        eligibility: 'विधिक सेवा प्राधिकरण अधिनियम, 1987 की धारा 12 के तहत पात्र नागरिक (महिलाएं, बच्चे, अनुसूचित जाति/जनजाति, दिव्यांग, श्रमिक, हिरासत में व्यक्ति एवं कम आय वाले परिवार) निःशुल्क पात्र हैं।',
        helpline: '14416 (टोल-फ्री हेल्पलाइन)',
        officialUrl: 'https://www.tele-law.in'
      };
    }

    return {
      title: 'Tele-Law Legal Aid Services',
      summary: 'Tele-Law connects citizens directly with panel lawyers for pre-litigation advice via video-conferencing at Common Service Centres (CSCs) and the Tele-Law Mobile App.',
      eligibility: 'Free legal consultation is provided to categories under Section 12 of the Legal Services Authorities Act, 1987 (women, children, SC/ST, persons with disabilities, industrial workmen, persons in custody, and low-income citizens).',
      helpline: '14416 (Toll-free National Helpline)',
      officialUrl: 'https://www.tele-law.in'
    };
  },

  /**
   * Information on Fast Track Special Courts (FTSCs)
   */
  getFTSCInfo(language = 'en') {
    if (language === 'hi') {
      return {
        title: 'फास्ट ट्रैक स्पेशल कोर्ट (FTSC) योजना',
        summary: 'फास्ट ट्रैक स्पेशल कोर्ट्स (FTSCs) केंद्र प्रायोजित योजना है, जो बलात्कार और पॉक्सो (POCSO) अधिनियम के तहत दर्ज मामलों के त्वरित और समयबद्ध निपटारे के लिए स्थापित की गई हैं।',
        operationalCount: '750 से अधिक विशेष अदालतें देश भर में कार्यरत हैं।',
        mandate: 'आपराधिक कानून (संशोधन) अधिनियम 2018 के तहत 2 महीने के भीतर मामलों का विचारण पूर्ण करने का लक्ष्य।'
      };
    }

    return {
      title: 'Fast Track Special Courts (FTSCs) Scheme',
      summary: 'FTSCs are a Centrally Sponsored Scheme formulated by the Department of Justice for expeditious and time-bound disposal of pending cases of rape and protection of children from sexual offences (POCSO Act).',
      operationalCount: 'Over 750 Fast Track Special Courts (including dedicated POCSO courts) are operational across the country.',
      mandate: 'Targeted trial completion within 2 months as per Criminal Law (Amendment) Act 2018.'
    };
  },

  /**
   * Information on Court Proceedings Live Streaming
   */
  getLiveStreamingInfo(language = 'en') {
    return {
      title: language === 'hi' ? 'न्यायालयी कार्यवाही का सीधा प्रसारण (Live Streaming)' : 'Live Streaming of Court Proceedings',
      courtsWithStreaming: [
        { court: 'Supreme Court of India', platform: 'YouTube / Official Webcast', link: 'https://webcast.gov.in/scindia' },
        { court: 'Gujarat High Court', platform: 'YouTube Official Channel', link: 'https://gujarathighcourt.nic.in' },
        { court: 'Karnataka High Court', platform: 'YouTube Official Channel', link: 'https://karnatakahi' },
        { court: 'Orissa High Court', platform: 'YouTube Official Channel', link: 'https://orissahighcourt.nic.in' },
        { court: 'Madhya Pradesh High Court', platform: 'YouTube Official Channel', link: 'https://mphc.gov.in' },
        { court: 'Patna High Court', platform: 'YouTube Official Channel', link: 'https://patnahighcourt.gov.in' }
      ],
      rulesNotice: language === 'hi'
        ? 'सीधा प्रसारण केवल सूचनात्मक उद्देश्यों के लिए है। इसका रिकॉर्डिंग, मॉर्फिंग या अनधिकृत प्रसार दंडनीय अपराध है।'
        : 'Live streaming is for informational transparency. Re-recording, unauthorized streaming, and morphing are prohibited under High Court Live Streaming Rules.'
    };
  },

  /**
   * eCourts Services Mobile App details
   */
  getMobileAppInfo(language = 'en') {
    return {
      title: language === 'hi' ? 'ई-कोर्ट्स सर्विसेज मोबाइल ऐप (eCourts Services Mobile App)' : 'eCourts Services Mobile Application',
      features: [
        'Search case status by CNR number, Case Number, Filing Number, or Party Name',
        'Scan QR code directly from physical summons or court notices',
        'Access daily cause lists and court display boards in real-time',
        'Save "My Cases" portfolio and receive automatic hearing date push notifications',
        'Available in multiple regional Indian languages'
      ],
      downloadLinks: {
        android: 'https://play.google.com/store/apps/details?id=in.gov.ecourts.eCourtsServices',
        ios: 'https://apps.apple.com/in/app/ecourts-services/id1250787310'
      }
    };
  }
};
