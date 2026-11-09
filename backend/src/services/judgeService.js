/**
 * Judge Statistics Service
 * Source: Department of Justice Monthly Vacancy Statements & Annual Reports
 * URL: https://doj.gov.in/appointments-of-judges/
 */

export const judgeService = {
  /**
   * Retrieves summary of sanctioned strength, working strength, and vacancies
   */
  async getSummary() {
    return {
      asOfDate: '2026-03-01',
      source: 'Department of Justice, Ministry of Law & Justice, Government of India',
      sourceUrl: 'https://doj.gov.in/appointments-of-judges/',
      summary: {
        supremeCourt: {
          courtName: 'Supreme Court of India',
          sanctioned: 34,
          working: 33,
          vacancies: 1,
          constitutionalProvision: 'Article 124 of Constitution of India'
        },
        highCourtsTotal: {
          courtCount: 25,
          sanctioned: 1114,
          working: 778,
          vacancies: 336,
          constitutionalProvision: 'Article 217 of Constitution of India'
        },
        districtAndSubordinateCourtsTotal: {
          sanctioned: 25200,
          working: 19850,
          vacancies: 5350,
          administeredBy: 'Respective High Courts and State Governments (Article 233-235)'
        }
      },
      topHighCourtVacancies: [
        { court: 'Allahabad High Court', sanctioned: 160, working: 89, vacancies: 71 },
        { court: 'Bombay High Court', sanctioned: 94, working: 66, vacancies: 28 },
        { court: 'Calcutta High Court', sanctioned: 72, working: 50, vacancies: 22 },
        { court: 'Punjab & Haryana High Court', sanctioned: 85, working: 55, vacancies: 30 },
        { court: 'Madras High Court', sanctioned: 75, working: 63, vacancies: 12 },
        { court: 'Delhi High Court', sanctioned: 60, working: 44, vacancies: 16 }
      ]
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
          `   - कुल स्वीकृत पद: ${data.summary.highCourtsTotal.sanctioned}\n` +
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
        `   - Total Sanctioned Strength: ${data.summary.highCourtsTotal.sanctioned}\n` +
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
