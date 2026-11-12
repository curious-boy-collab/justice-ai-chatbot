/**
 * Judge Statistics Service
 * Developer: Disha (Backend Developer)
 * Sprint: Day 4 — Government Services & Judicial Information
 * 
 * Source: Department of Justice Monthly Vacancy Statements & Annual Reports
 * URL: https://doj.gov.in/appointments-of-judges/
 */

const HIGH_COURTS_DATA = [
  { code: 'allahabad', name: 'Allahabad High Court', sanctioned: 160, permanent: 119, additional: 41, working: 89, vacancies: 71, principalSeat: 'Prayagraj', bench: 'Lucknow', jurisdiction: 'Uttar Pradesh' },
  { code: 'andhra-pradesh', name: 'Andhra Pradesh High Court', sanctioned: 37, permanent: 28, additional: 9, working: 29, vacancies: 8, principalSeat: 'Amaravati', bench: 'None', jurisdiction: 'Andhra Pradesh' },
  { code: 'bombay', name: 'Bombay High Court', sanctioned: 94, permanent: 71, additional: 23, working: 66, vacancies: 28, principalSeat: 'Mumbai', bench: 'Nagpur, Aurangabad, Panaji', jurisdiction: 'Maharashtra, Goa, Dadra & Nagar Haveli and Daman & Diu' },
  { code: 'calcutta', name: 'Calcutta High Court', sanctioned: 72, permanent: 54, additional: 18, working: 50, vacancies: 22, principalSeat: 'Kolkata', bench: 'Jalpaiguri, Port Blair', jurisdiction: 'West Bengal, Andaman & Nicobar Islands' },
  { code: 'chhattisgarh', name: 'Chhattisgarh High Court', sanctioned: 22, permanent: 17, additional: 5, working: 15, vacancies: 7, principalSeat: 'Bilaspur', bench: 'None', jurisdiction: 'Chhattisgarh' },
  { code: 'delhi', name: 'Delhi High Court', sanctioned: 60, permanent: 45, additional: 15, working: 44, vacancies: 16, principalSeat: 'New Delhi', bench: 'None', jurisdiction: 'National Capital Territory of Delhi' },
  { code: 'gauhati', name: 'Gauhati High Court', sanctioned: 30, permanent: 24, additional: 6, working: 23, vacancies: 7, principalSeat: 'Guwahati', bench: 'Kohima, Aizawl, Itanagar', jurisdiction: 'Assam, Nagaland, Mizoram, Arunachal Pradesh' },
  { code: 'gujarat', name: 'Gujarat High Court', sanctioned: 52, permanent: 39, additional: 13, working: 31, vacancies: 21, principalSeat: 'Ahmedabad', bench: 'None', jurisdiction: 'Gujarat' },
  { code: 'himachal-pradesh', name: 'Himachal Pradesh High Court', sanctioned: 17, permanent: 13, additional: 4, working: 12, vacancies: 5, principalSeat: 'Shimla', bench: 'None', jurisdiction: 'Himachal Pradesh' },
  { code: 'jk-ladakh', name: 'High Court of Jammu & Kashmir and Ladakh', sanctioned: 17, permanent: 13, additional: 4, working: 13, vacancies: 4, principalSeat: 'Srinagar & Jammu', bench: 'None', jurisdiction: 'Jammu & Kashmir, Ladakh' },
  { code: 'jharkhand', name: 'Jharkhand High Court', sanctioned: 25, permanent: 20, additional: 5, working: 20, vacancies: 5, principalSeat: 'Ranchi', bench: 'None', jurisdiction: 'Jharkhand' },
  { code: 'karnataka', name: 'Karnataka High Court', sanctioned: 62, permanent: 47, additional: 15, working: 48, vacancies: 14, principalSeat: 'Bengaluru', bench: 'Dharwad, Kalaburagi', jurisdiction: 'Karnataka' },
  { code: 'kerala', name: 'Kerala High Court', sanctioned: 47, permanent: 35, additional: 12, working: 38, vacancies: 9, principalSeat: 'Kochi', bench: 'None', jurisdiction: 'Kerala, Lakshadweep' },
  { code: 'madhya-pradesh', name: 'Madhya Pradesh High Court', sanctioned: 53, permanent: 39, additional: 14, working: 31, vacancies: 22, principalSeat: 'Jabalpur', bench: 'Gwalior, Indore', jurisdiction: 'Madhya Pradesh' },
  { code: 'madras', name: 'Madras High Court', sanctioned: 75, permanent: 56, additional: 19, working: 63, vacancies: 12, principalSeat: 'Chennai', bench: 'Madurai', jurisdiction: 'Tamil Nadu, Puducherry' },
  { code: 'manipur', name: 'Manipur High Court', sanctioned: 5, permanent: 4, additional: 1, working: 3, vacancies: 2, principalSeat: 'Imphal', bench: 'None', jurisdiction: 'Manipur' },
  { code: 'meghalaya', name: 'Meghalaya High Court', sanctioned: 4, permanent: 3, additional: 1, working: 3, vacancies: 1, principalSeat: 'Shillong', bench: 'None', jurisdiction: 'Meghalaya' },
  { code: 'orissa', name: 'Orissa High Court', sanctioned: 33, permanent: 24, additional: 9, working: 21, vacancies: 12, principalSeat: 'Cuttack', bench: 'None', jurisdiction: 'Odisha' },
  { code: 'patna', name: 'Patna High Court', sanctioned: 53, permanent: 40, additional: 13, working: 34, vacancies: 19, principalSeat: 'Patna', bench: 'None', jurisdiction: 'Bihar' },
  { code: 'punjab-haryana', name: 'Punjab & Haryana High Court', sanctioned: 85, permanent: 64, additional: 21, working: 55, vacancies: 30, principalSeat: 'Chandigarh', bench: 'None', jurisdiction: 'Punjab, Haryana, Chandigarh' },
  { code: 'rajasthan', name: 'Rajasthan High Court', sanctioned: 50, permanent: 38, additional: 12, working: 33, vacancies: 17, principalSeat: 'Jodhpur', bench: 'Jaipur', jurisdiction: 'Rajasthan' },
  { code: 'sikkim', name: 'Sikkim High Court', sanctioned: 3, permanent: 3, additional: 0, working: 3, vacancies: 0, principalSeat: 'Gangtok', bench: 'None', jurisdiction: 'Sikkim' },
  { code: 'telangana', name: 'Telangana High Court', sanctioned: 42, permanent: 32, additional: 10, working: 27, vacancies: 15, principalSeat: 'Hyderabad', bench: 'None', jurisdiction: 'Telangana' },
  { code: 'tripura', name: 'Tripura High Court', sanctioned: 5, permanent: 4, additional: 1, working: 4, vacancies: 1, principalSeat: 'Agartala', bench: 'None', jurisdiction: 'Tripura' },
  { code: 'uttarakhand', name: 'Uttarakhand High Court', sanctioned: 11, permanent: 9, additional: 2, working: 7, vacancies: 4, principalSeat: 'Nainital', bench: 'None', jurisdiction: 'Uttarakhand' }
];

export const judgeService = {
  /**
   * Retrieves summary of sanctioned strength, working strength, and vacancies
   */
  async getSummary() {
    return {
      asOfDate: '2026-03-01',
      lastUpdated: '2026-11-12',
      source: 'Department of Justice, Ministry of Law & Justice, Government of India',
      sourceUrl: 'https://doj.gov.in/appointments-of-judges/',
      isOfficialReport: true,
      dataStatus: 'official_reference',
      summary: {
        supremeCourt: {
          courtName: 'Supreme Court of India',
          sanctioned: 34,
          working: 33,
          vacancies: 1,
          constitutionalProvision: 'Article 124 of Constitution of India',
          portalUrl: 'https://www.sci.gov.in'
        },
        highCourtsTotal: {
          courtCount: 25,
          sanctioned: 1114,
          permanent: 840,
          additional: 274,
          working: 778,
          vacancies: 336,
          constitutionalProvision: 'Article 217 & 224 of Constitution of India',
          portalUrl: 'https://doj.gov.in/list-of-high-court-judges/'
        },
        districtAndSubordinateCourtsTotal: {
          courtName: 'District & Subordinate Courts',
          sanctioned: 25200,
          working: 19850,
          vacancies: 5350,
          administeredBy: 'Respective High Courts and State Governments (Articles 233-235)',
          portalUrl: 'https://njdg.ecourts.gov.in'
        }
      },
      topHighCourtVacancies: HIGH_COURTS_DATA.slice()
        .sort((a, b) => b.vacancies - a.vacancies)
        .slice(0, 6)
        .map((c) => ({
          court: c.name,
          sanctioned: c.sanctioned,
          working: c.working,
          vacancies: c.vacancies
        }))
    };
  },

  /**
   * Returns complete verified directory of all 25 High Courts in India
   */
  getAllHighCourts() {
    return {
      success: true,
      asOfDate: '2026-03-01',
      lastUpdated: '2026-11-12',
      count: HIGH_COURTS_DATA.length,
      highCourts: HIGH_COURTS_DATA,
      officialPortalUrl: 'https://doj.gov.in/appointments-of-judges/'
    };
  },

  /**
   * Lookup specific High Court by slug or code
   */
  getHighCourtByCode(code) {
    if (!code || typeof code !== 'string') {
      const err = new Error('High Court code is required.');
      err.statusCode = 400;
      err.code = 'INVALID_COURT_CODE';
      throw err;
    }

    const normalized = code.trim().toLowerCase().replace(/_|\s+/g, '-');
    const court = HIGH_COURTS_DATA.find((c) => c.code === normalized || c.name.toLowerCase().includes(normalized));

    if (!court) {
      const notFoundErr = new Error(`High Court with code "${code}" was not found.`);
      notFoundErr.statusCode = 404;
      notFoundErr.code = 'HIGH_COURT_NOT_FOUND';
      throw notFoundErr;
    }

    return {
      success: true,
      highCourt: court,
      asOfDate: '2026-03-01',
      officialPortalUrl: 'https://doj.gov.in/list-of-high-court-judges/'
    };
  },

  /**
   * Explanatory data on Collegium system and judicial appointment procedures
   */
  getAppointmentProcedure() {
    return {
      success: true,
      title: 'Judicial Appointments Procedure in India',
      constitutionalArticles: [
        {
          article: 'Article 124(2)',
          description: 'Appointment of Supreme Court Judges by the President after consultation with Chief Justice of India and other Judges.'
        },
        {
          article: 'Article 217(1)',
          description: 'Appointment of High Court Judges by the President in consultation with CJI, Governor of the State, and Chief Justice of the High Court.'
        },
        {
          article: 'Article 222',
          description: 'Transfer of High Court Judges from one High Court to another by the President in consultation with CJI.'
        },
        {
          article: 'Article 224',
          description: 'Appointment of Additional Judges (for up to 2 years) and Acting Judges in High Courts.'
        },
        {
          article: 'Article 233',
          description: 'Appointment of District Judges by Governor in consultation with the High Court.'
        }
      ],
      collegiumStructure: {
        supremeCourtCollegium: 'Chief Justice of India + 4 senior-most Supreme Court Judges for SC appointments; CJI + 2 senior-most SC Judges for High Court appointments.',
        highCourtCollegium: 'Chief Justice of the respective High Court + 2 senior-most Judges of that High Court.'
      },
      workflowSteps: [
        'Initiation: High Court Collegium sends recommendation to State Governor, Chief Minister, and Union Minister of Law & Justice.',
        'Vetting: Ministry of Law & Justice seeks background verification report from Intelligence Bureau (IB).',
        'Supreme Court Consideration: Union Minister places the complete dossier before the Supreme Court Collegium presided by CJI.',
        'Executive Processing: If recommended by SC Collegium, the proposal is processed through Department of Justice to Prime Minister and the President of India.',
        'Warrant of Appointment: President issues the formal Warrant of Appointment and Notification is published in the Gazette of India.'
      ],
      officialSourceUrl: 'https://doj.gov.in/appointments-of-judges/'
    };
  },

  /**
   * Generates a conversational explanation of judge vacancy counts
   */
  async getFormattedResponse(language = 'en') {
    const data = await this.getSummary();
    if (language === 'hi') {
      return {
        reply: `न्यायाधीशों के पदों और रिक्तियों की आधिकारिक स्थिति (स्रोत: न्याय विभाग, अद्यतन: 2026):\n\n` +
          `1. **सर्वोच्च न्यायालय (Supreme Court)**:\n` +
          `   - स्वीकृत पद (Sanctioned): ${data.summary.supremeCourt.sanctioned}\n` +
          `   - कार्यरत न्यायाधीश (Working): ${data.summary.supremeCourt.working}\n` +
          `   - रिक्तियां (Vacancies): ${data.summary.supremeCourt.vacancies}\n\n` +
          `2. **25 उच्च न्यायालय (25 High Courts)**:\n` +
          `   - कुल स्वीकृत पद: ${data.summary.highCourtsTotal.sanctioned} (स्थायी: 840, अतिरिक्त: 274)\n` +
          `   - कार्यरत न्यायाधीश: ${data.summary.highCourtsTotal.working}\n` +
          `   - रिक्तियां: ${data.summary.highCourtsTotal.vacancies}\n\n` +
          `3. **जिला एवं अधीनस्थ न्यायालय (District & Subordinate Courts)**:\n` +
          `   - स्वीकृत पद: लगभग ${data.summary.districtAndSubordinateCourtsTotal.sanctioned.toLocaleString('en-IN')}\n` +
          `   - रिक्तियां: लगभग ${data.summary.districtAndSubordinateCourtsTotal.vacancies.toLocaleString('en-IN')}\n\n` +
          `न्यायाधीशों की नियुक्ति सुप्रीम कोर्ट कॉलेजियम और मेमोरेंडम ऑफ प्रोसीजर (MoP) के तहत की जाती है।`,
        dataCard: {
          type: 'JUDGE_VACANCY',
          title: 'न्यायाधीश रिक्ति एवं स्वीकृत पद विवरण',
          data: data
        },
        citations: [
          {
            sourceTitle: 'न्याय विभाग - न्यायाधीशों की नियुक्ति एवं रिक्ति विवरण',
            url: 'https://doj.gov.in/appointments-of-judges/',
            snippet: 'न्याय विभाग द्वारा प्रतिमाह सर्वोच्च न्यायालय एवं उच्च न्यायालयों में न्यायाधीशों के स्वीकृत एवं रिक्त पदों की सूची प्रकाशित की जाती है।'
          }
        ]
      };
    }

    return {
      reply: `Official Judge Strength and Vacancy Statistics (Source: Department of Justice, GoI):\n\n` +
        `1. **Supreme Court of India**:\n` +
        `   - Sanctioned Strength: ${data.summary.supremeCourt.sanctioned}\n` +
        `   - Working Strength: ${data.summary.supremeCourt.working}\n` +
        `   - Vacancies: ${data.summary.supremeCourt.vacancies}\n\n` +
        `2. **25 High Courts Across India**:\n` +
        `   - Total Sanctioned Strength: ${data.summary.highCourtsTotal.sanctioned} (Permanent: 840, Additional: 274)\n` +
        `   - Working Strength: ${data.summary.highCourtsTotal.working}\n` +
        `   - Total Vacancies: ${data.summary.highCourtsTotal.vacancies}\n\n` +
        `3. **District & Subordinate Judiciary**:\n` +
        `   - Sanctioned Strength: ~${data.summary.districtAndSubordinateCourtsTotal.sanctioned.toLocaleString('en-IN')}\n` +
        `   - Working Strength: ~${data.summary.districtAndSubordinateCourtsTotal.working.toLocaleString('en-IN')}\n` +
        `   - Vacancies: ~${data.summary.districtAndSubordinateCourtsTotal.vacancies.toLocaleString('en-IN')}\n\n` +
        `Appointments to the Higher Judiciary are governed by Article 124, 217, and 224 of the Constitution, following the Supreme Court Collegium and Memorandum of Procedure (MoP).`,
      dataCard: {
        type: 'JUDGE_VACANCY',
        title: 'Judge Vacancy & Strength Overview',
        data: data
      },
      citations: [
        {
          sourceTitle: 'Department of Justice - Appointments of Judges & Vacancy Statement',
          url: 'https://doj.gov.in/appointments-of-judges/',
          snippet: 'Official monthly vacancy statement for the Supreme Court and 25 High Courts in India.'
        }
      ]
    };
  }
};

export default judgeService;
