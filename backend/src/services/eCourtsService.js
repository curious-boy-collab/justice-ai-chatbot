/**
 * eCourts and Citizen Judicial Services Integration Module
 * Developer: Disha (Backend Developer)
 * Sprint: Day 4 — Government Services & Judicial Information
 * 
 * Covers: Case Status Lookup, Virtual Courts, eFiling 3.0, ePay, Tele-Law,
 * Fast Track Special Courts, eCourts Mobile App, and Court Live Streaming.
 */

// Curated realistic sandbox records for demonstration and offline testing
const DEMO_CASE_RECORDS = {
  'DLHC010012342023': {
    cnr: 'DLHC010012342023',
    caseTitle: 'Aarav Sharma vs. State of NCT of Delhi & Anr.',
    caseType: 'Writ Petition (Civil) - W.P.(C)',
    filingNumber: 'WP(C)/1234/2023',
    filingDate: '2023-04-18',
    registrationNumber: '1234/2023',
    registrationDate: '2023-04-20',
    courtName: 'High Court of Delhi at New Delhi',
    bench: 'Division Bench (Hon\'ble Mr. Justice R.K. Verma & Hon\'ble Ms. Justice P. Gupta)',
    courtHall: 'Court Room No. 4',
    caseStage: 'Final Hearing / Arguments',
    nextHearingDate: '2026-11-28',
    petitioner: 'Aarav Sharma (S/o Late M.L. Sharma)',
    petitionerAdvocate: 'Adv. Priya Malhotra (D/1420/2012)',
    respondent: 'State of NCT of Delhi through Secretary (Revenue) & Municipal Corporation',
    respondentAdvocate: 'Standing Counsel GNCTD (Adv. Rajesh Nambiar)',
    policeStation: 'Tilak Marg Police Station',
    firNumber: 'Not Applicable (Civil Writ)',
    lastOrderDate: '2026-10-15',
    lastOrderSummary: 'Part-heard. Arguments on preliminary objections concluded. Rejoinder filed. Listed for continuation of arguments.',
    isLive: false,
    dataStatus: 'demo_sandbox',
    officialPortalUrl: 'https://services.ecourts.gov.in/ecourtindia_v6/?p=casestatus'
  },
  'MHMB010056782022': {
    cnr: 'MHMB010056782022',
    caseTitle: 'M/s Western Logistics Pvt. Ltd. vs. Union of India & Ors.',
    caseType: 'Commercial Appeal - COMAP',
    filingNumber: 'COMAP/5678/2022',
    filingDate: '2022-09-12',
    registrationNumber: '5678/2022',
    registrationDate: '2022-09-15',
    courtName: 'High Court of Judicature at Bombay (Principal Seat)',
    bench: 'Commercial Appellate Division Bench',
    courtHall: 'Court Room No. 12',
    caseStage: 'Order Reserved',
    nextHearingDate: '2026-11-22',
    petitioner: 'M/s Western Logistics Pvt. Ltd. through Director',
    petitionerAdvocate: 'Adv. Cyrus Bharucha (MAH/4521/2005)',
    respondent: 'Union of India through Ministry of Shipping & Port Trust Authority',
    respondentAdvocate: 'Additional Solicitor General of India',
    policeStation: 'Not Applicable',
    firNumber: 'Not Applicable',
    lastOrderDate: '2026-10-28',
    lastOrderSummary: 'Matter heard at length. Written notes of arguments submitted by both counsels. Closed for judgment.',
    isLive: false,
    dataStatus: 'demo_sandbox',
    officialPortalUrl: 'https://services.ecourts.gov.in/ecourtindia_v6/?p=casestatus'
  },
  'UPAL010098762021': {
    cnr: 'UPAL010098762021',
    caseTitle: 'Rameshwar Dayal vs. Deputy Director of Consolidation & Others',
    caseType: 'Civil Miscellaneous Writ - WRIT-B',
    filingNumber: 'WRITB/9876/2021',
    filingDate: '2021-07-05',
    registrationNumber: '9876/2021',
    registrationDate: '2021-07-08',
    courtName: 'High Court of Judicature at Allahabad',
    bench: 'Single Judge (Hon\'ble Mr. Justice S.N. Srivastava)',
    courtHall: 'Court Room No. 22',
    caseStage: 'Evidence / Counter Affidavit',
    nextHearingDate: '2026-12-05',
    petitioner: 'Rameshwar Dayal (Resident of Tehsil Sadar, Prayagraj)',
    petitionerAdvocate: 'Adv. Dinesh Chandra Tripathi',
    respondent: 'Deputy Director of Consolidation, Prayagraj & 4 Others',
    respondentAdvocate: 'Chief Standing Counsel (State of UP)',
    policeStation: 'Not Applicable',
    firNumber: 'Not Applicable',
    lastOrderDate: '2026-09-14',
    lastOrderSummary: 'Counter affidavit filed by respondent no. 3 accepted. 3 weeks time granted to petitioner to file rejoinder.',
    isLive: false,
    dataStatus: 'demo_sandbox',
    officialPortalUrl: 'https://services.ecourts.gov.in/ecourtindia_v6/?p=casestatus'
  }
};

export const eCourtsService = {
  /**
   * Validates and parses a 16-character alphanumeric CNR number
   */
  validateAndParseCNR(cnr) {
    if (!cnr || typeof cnr !== 'string') {
      return { isValid: false, reason: 'CNR number is required and must be a string.' };
    }

    const cleanCnr = cnr.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');

    if (cleanCnr.length !== 16) {
      return {
        isValid: false,
        cnr: cleanCnr,
        reason: `Invalid CNR length (${cleanCnr.length} chars). CNR must be exactly 16 alphanumeric characters without spaces or hyphens.`
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
        reason: `Invalid filing year in CNR: "${filingYear}". Year must be between 1950 and ${currentYear + 1}.`
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
      officialPortalUrl: 'https://services.ecourts.gov.in/ecourtindia_v6/?p=casestatus'
    };
  },

  /**
   * Case status lookup engine (supports verified demo sandbox records with explicit live status flags)
   */
  lookupCaseStatus(cnr) {
    const validation = this.validateAndParseCNR(cnr);
    if (!validation.isValid) {
      return validation;
    }

    const cleanCnr = validation.cnr;

    // Check if this CNR matches one of our curated sandbox cases
    if (DEMO_CASE_RECORDS[cleanCnr]) {
      return {
        isValid: true,
        isValidCnrFormat: true,
        cnr: cleanCnr,
        isLive: false,
        dataStatus: 'demo_sandbox',
        notice: 'DEMO SAMPLE DATA — For live verification of real-time orders, visit the official eCourts portal.',
        ...DEMO_CASE_RECORDS[cleanCnr],
        dataFreshness: {
          lastVerified: '2026-11-12',
          sourceStatus: 'demo_curated_record',
          officialPortalUrl: 'https://services.ecourts.gov.in/ecourtindia_v6/?p=casestatus'
        }
      };
    }

    // For any other valid 16-character CNR, return parsed format + live CAPTCHA redirection notice
    return {
      isValid: true,
      isValidCnrFormat: true,
      cnr: cleanCnr,
      isLive: false,
      dataStatus: 'live_lookup_requires_captcha',
      notice: 'LIVE CAPTCHA REQUIREMENT: Real-time case tracking on the National eCourts Services portal requires security CAPTCHA verification to prevent automated mass data harvesting.',
      parsed: validation.parsed,
      guidance: {
        step1: 'Click the official eCourts link below to open the Case Status portal.',
        step2: 'The 16-character CNR number will be pre-identified.',
        step3: 'Enter the captcha image displayed on screen and submit.',
        step4: 'You can view complete cause title, daily order sheets, certified copy status, and next hearing date.'
      },
      officialPortalUrl: 'https://services.ecourts.gov.in/ecourtindia_v6/?p=casestatus',
      smsService: 'Send SMS: "ECOURTS <16 Digit CNR>" to 9766899899',
      dataFreshness: {
        lastVerified: '2026-11-12',
        sourceStatus: 'official_portal_guidance',
        officialPortalUrl: 'https://services.ecourts.gov.in/ecourtindia_v6/?p=casestatus'
      }
    };
  },

  /**
   * Returns list of available sandbox demo CNR numbers for testing
   */
  getDemoSamples() {
    return {
      success: true,
      notice: 'Curated sandbox cases for UI testing and demonstration.',
      samples: Object.keys(DEMO_CASE_RECORDS).map((cnr) => ({
        cnr,
        caseTitle: DEMO_CASE_RECORDS[cnr].caseTitle,
        caseType: DEMO_CASE_RECORDS[cnr].caseType,
        courtName: DEMO_CASE_RECORDS[cnr].courtName,
        nextHearingDate: DEMO_CASE_RECORDS[cnr].nextHearingDate
      }))
    };
  },

  /**
   * Citizen guidance on finding CNR numbers and alternative search methods
   */
  getCaseGuidance(language = 'en') {
    if (language === 'hi') {
      return {
        title: 'केस स्टेटस एवं सीएनआर (CNR) नंबर मार्गदर्शन',
        cnrExplanation: 'CNR का पूर्ण रूप "Case Number Record" है। यह देश के प्रत्येक न्यायालयीन मामले के लिए जारी 16-अंकीय विशिष्ट पहचान संख्या है।',
        whereToFindCNR: [
          'न्यायालय द्वारा जारी समन या नोटिस के ऊपरी दाएं कोने पर मुद्रित बारकोड/QR कोड के नीचे।',
          'वकील द्वारा दी गई केस फाइलिंग पावती (eFiling Acknowledgment Slip) पर।',
          'न्यायालय परिसर में ई-सेवा केंद्र (eSewa Kendra) पर पूछताछ कर।'
        ],
        alternativeSearchMethods: [
          'केस नंबर एवं वर्ष (Case Number & Year)',
          'वादी या प्रतिवादी का नाम (Party Name Search)',
          'अधिवक्ता का नाम अथवा बार काउंसिल नंबर (Advocate Search)',
          'प्राथमिकी संख्या (FIR Number Search - आपराधिक मामलों हेतु)',
          'फाइलिंग नंबर (Filing Number Search)'
        ],
        smsInquiry: 'SMS प्रारूप: ECOURTS <16 Digit CNR> लिखकर 9766899899 पर भेजें।',
        officialPortalUrl: 'https://services.ecourts.gov.in/ecourtindia_v6/?p=casestatus'
      };
    }

    return {
      title: 'Case Status Lookup & CNR Number Guidance',
      cnrExplanation: 'A CNR (Case Number Record) is a unique 16-character alphanumeric code assigned to every case filed in Indian District Courts and High Courts.',
      whereToFindCNR: [
        'Printed directly below the barcode/QR code on physical court summons or notices.',
        'On the eFiling electronic filing acknowledgment receipt provided by your advocate.',
        'At any eSewa Kendra (Help Desk) located inside court complexes across India.'
      ],
      alternativeSearchMethods: [
        'Case Type, Case Number, and Registration Year',
        'Party Name Search (Petitioner or Respondent name)',
        'Advocate Name or Bar Council Enrollment Number',
        'FIR Number and Police Station (for criminal matters)',
        'Filing Number and Filing Date'
      ],
      smsInquiry: 'Send SMS: "ECOURTS <16 Digit CNR>" to 9766899899 for instant status.',
      officialPortalUrl: 'https://services.ecourts.gov.in/ecourtindia_v6/?p=casestatus'
    };
  },

  /**
   * State-wise Virtual Courts directory with direct portal links
   */
  getVirtualCourtsDirectory() {
    const states = [
      { state: 'Delhi', department: 'Delhi Traffic Police & Notice Branch', portalUrl: 'https://vcourts.gov.in', activeCourts: 2 },
      { state: 'Maharashtra', department: 'Maharashtra Motor Vehicles Department / Traffic', portalUrl: 'https://vcourts.gov.in', activeCourts: 3 },
      { state: 'Tamil Nadu', department: 'Tamil Nadu Traffic Police', portalUrl: 'https://vcourts.gov.in', activeCourts: 2 },
      { state: 'Karnataka', department: 'Bengaluru Traffic Police & State Transport', portalUrl: 'https://vcourts.gov.in', activeCourts: 2 },
      { state: 'Uttar Pradesh', department: 'UP Traffic Police & Transport', portalUrl: 'https://vcourts.gov.in', activeCourts: 2 },
      { state: 'Gujarat', department: 'Ahmedabad & Surat Traffic Police', portalUrl: 'https://vcourts.gov.in', activeCourts: 2 },
      { state: 'Haryana', department: 'Haryana State Transport & Traffic', portalUrl: 'https://vcourts.gov.in', activeCourts: 1 },
      { state: 'Kerala', department: 'Kerala Motor Vehicles Department', portalUrl: 'https://vcourts.gov.in', activeCourts: 2 },
      { state: 'Madhya Pradesh', department: 'MP Police & Virtual Traffic Court', portalUrl: 'https://vcourts.gov.in', activeCourts: 2 },
      { state: 'Rajasthan', department: 'Rajasthan Traffic Department', portalUrl: 'https://vcourts.gov.in', activeCourts: 1 }
    ];

    return {
      success: true,
      title: 'Virtual Courts Portal Directory (vcourts.gov.in)',
      description: 'Virtual Courts eliminate the physical presence of litigants or advocates in court for petty and compounding traffic offences.',
      workflow: [
        '1. Search: Enter Mobile Number, Challan Number, or Vehicle Registration Number.',
        '2. Verification: Verify offence details, captured photos, and compounded penalty.',
        '3. Plead Guilty: Accept offense online and pay fine immediately via ePay gateway (UPI, NetBanking, Cards).',
        '4. Contest: If you dispute the fine, choose "Contest" to transfer the summons to a regular magistrate court.'
      ],
      statesCount: states.length,
      states,
      nationalPortalUrl: 'https://vcourts.gov.in',
      parivahanChallanUrl: 'https://echallan.parivahan.gov.in',
      helpline: '1800-11-0031'
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
        parivahanUrl: 'https://echallan.parivahan.gov.in',
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
      parivahanUrl: 'https://echallan.parivahan.gov.in',
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
        requirements: [
          'दस्तावेज OCR-सक्षम PDF प्रारूप में होने चाहिए।',
          'वैध मोबाइल नंबर व आधार से जुड़ा eSign या USB DSC टोकन।',
          'कोर्ट फीस भुगतान हेतु नेट बैंकिंग, UPI या SBI ePay।'
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
      requirements: [
        'Pleadings and annexures in searchable PDF/A format (resolution 200–300 DPI).',
        'Valid Aadhaar-linked mobile for eSign or Class-III Digital Signature Certificate (DSC).',
        'Integrated ePay gateway supports UPI, Net Banking, Debit Cards, and Bharatkosh.'
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
        officialUrl: 'https://www.tele-law.in',
        mobileApp: 'Tele-Law Mobile App (Google Play Store & Apple App Store)'
      };
    }

    return {
      title: 'Tele-Law Legal Aid Services',
      summary: 'Tele-Law connects citizens directly with panel lawyers for pre-litigation advice via video-conferencing at Common Service Centres (CSCs) and the Tele-Law Mobile App.',
      eligibility: 'Free legal consultation is provided to categories under Section 12 of the Legal Services Authorities Act, 1987 (women, children, SC/ST, persons with disabilities, industrial workmen, persons in custody, and low-income citizens).',
      helpline: '14416 (Toll-free National Helpline)',
      officialUrl: 'https://www.tele-law.in',
      mobileApp: 'Tele-Law Mobile App (Google Play Store & Apple App Store)'
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
        operationalCount: '750 से अधिक विशेष अदालतें (400+ अनन्य पॉक्सो अदालतें) देश भर में कार्यरत हैं।',
        mandate: 'आपराधिक कानून (संशोधन) अधिनियम 2018 के तहत 2 महीने के भीतर मामलों का विचारण पूर्ण करने का लक्ष्य।',
        officialUrl: 'https://doj.gov.in/fast-track-special-court-ftsc/'
      };
    }

    return {
      title: 'Fast Track Special Courts (FTSCs) Scheme',
      summary: 'FTSCs are a Centrally Sponsored Scheme formulated by the Department of Justice for expeditious and time-bound disposal of pending cases of rape and protection of children from sexual offences (POCSO Act).',
      operationalCount: 'Over 750 Fast Track Special Courts (including 400+ exclusive POCSO courts) are operational across 30 States/UTs.',
      mandate: 'Targeted trial completion within 2 months as per Criminal Law (Amendment) Act 2018.',
      officialUrl: 'https://doj.gov.in/fast-track-special-court-ftsc/'
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
        ? 'सीधा प्रसारण केवल सूचनात्मक पारदर्शिता के लिए है। इसका रिकॉर्डिंग, मॉर्फिंग या अनधिकृत प्रसार दंडनीय अपराध है।'
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

export default eCourtsService;
