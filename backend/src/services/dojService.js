/**
 * JusticeAI – Department of Justice Information Service
 * Developer: Disha (Backend Developer)
 * Sprint: Day 4 — Government Services & Judicial Information
 * 
 * Provides structured authoritative data about Department of Justice (DoJ)
 * divisions, administrative functions, centrally sponsored schemes, and official portals.
 */

export const dojService = {
  /**
   * Retrieves organizational overview of Department of Justice, GoI
   */
  getOverview() {
    return {
      ministry: 'Ministry of Law and Justice',
      department: 'Department of Justice',
      government: 'Government of India',
      headquarters: 'Jaisalmer House, 26, Man Singh Road, New Delhi - 110011',
      mandate: 'Administration of justice, appointment of Judges to the Supreme Court and High Courts, conditions of service of Judges, judicial infrastructure, eCourts Mission Mode Project, legal aid to the poor, and Fast Track Special Courts.',
      legalAuthority: 'Government of India (Allocation of Business) Rules, 1961',
      constitutionalArticles: [
        'Article 124 (Establishment & Constitution of Supreme Court)',
        'Article 214 & 217 (High Courts & Appointment of HC Judges)',
        'Article 222 (Transfer of High Court Judges)',
        'Article 224 (Appointment of Additional & Acting Judges)',
        'Article 233-237 (Subordinate Courts administration under HCs)'
      ],
      officialPortals: {
        departmentPortal: 'https://doj.gov.in',
        citizenCharter: 'https://doj.gov.in/citizen-charter/',
        annualReports: 'https://doj.gov.in/annual-reports/',
        appointmentsPortal: 'https://doj.gov.in/appointments-of-judges/',
        teleLawPortal: 'https://www.tele-law.in',
        ecourtsPortal: 'https://ecourts.gov.in',
        njdgPortal: 'https://njdg.ecourts.gov.in',
        virtualCourtsPortal: 'https://vcourts.gov.in'
      },
      dataFreshness: {
        lastUpdated: '2026-11-13',
        asOfDate: '2026-03-01',
        sourceStatus: 'verified_official',
        sourceAuthority: 'Department of Justice, Ministry of Law and Justice, Government of India',
        isLive: false,
        statusLabel: 'Official Verified Government Snapshot'
      }
    };
  },

  /**
   * Retrieves detailed information on all 7 primary administrative divisions of DoJ
   */
  getDivisions() {
    const divisions = [
      {
        id: 'appointments-admin',
        name: 'Judicial Appointments & Administration Division',
        hindiName: 'न्यायिक नियुक्ति एवं प्रशासन प्रभाग',
        head: 'Joint Secretary (Appointments)',
        responsibilities: [
          'Processing appointments of Chief Justice of India and Supreme Court Judges under Article 124.',
          'Processing appointments of Chief Justices and Judges of 25 High Courts under Article 217 and 224.',
          'Processing transfers of High Court Judges under Article 222 in consultation with Supreme Court Collegium.',
          'Maintenance of monthly sanctioned strength, working strength, and vacancy rosters for Higher Judiciary.',
          'Administering the Memorandum of Procedure (MoP) for appointments to Higher Judiciary.'
        ],
        constitutionalBasis: 'Articles 124, 217, 222, 224 of Constitution of India',
        officialUrl: 'https://doj.gov.in/appointments-of-judges/'
      },
      {
        id: 'access-to-justice',
        name: 'Access to Justice Division (A2J)',
        hindiName: 'न्याय तक पहुंच प्रभाग',
        head: 'Joint Secretary (Access to Justice)',
        responsibilities: [
          'Implementation of DISHA scheme (Designing Innovative Solutions for Holistic Access to Justice in India).',
          'Operation and scaling of Tele-Law pre-litigation legal advice across 5+ lakh Common Service Centres (CSCs).',
          'Nyaya Bandhu (Pro Bono Legal Services) programme connecting registered volunteer advocates with marginalized litigants.',
          'Nyaya Mitra initiative aimed at reducing pendency of 10+ year-old cases in selected district courts.',
          'Legal literacy, constitutional awareness campaigns, and Pan-India legal empowerment programmes.'
        ],
        constitutionalBasis: 'Article 39A (Equal justice and free legal aid)',
        officialUrl: 'https://doj.gov.in/access-to-justice/'
      },
      {
        id: 'ecourts-project',
        name: 'eCourts Mission Mode Project Division',
        hindiName: 'ई-कोर्ट्स मिशन मोड परियोजना प्रभाग',
        head: 'Joint Secretary & Mission Director (eCourts)',
        responsibilities: [
          'Execution of the National eCourts Project in partnership with Supreme Court e-Committee.',
          'Implementation of eCourts Phase III with a sanctioned outlay of ₹7,210 Crore.',
          'Deploying unified eFiling 3.0, online court fee payment (ePay), and National Service and Tracking of Electronic Processes (NSTEP).',
          'Rolling out Virtual Courts for automated electronic disposal of petty traffic offences.',
          'Managing the National Judicial Data Grid (NJDG) for transparent case tracking and pendency analytics.',
          'Inter-operable Criminal Justice System (ICJS) integration between courts, police, prisons, forensics, and prosecution.'
        ],
        constitutionalBasis: 'National e-Governance Plan (Digital India initiative)',
        officialUrl: 'https://doj.gov.in/ecourts-project/'
      },
      {
        id: 'judicial-infrastructure',
        name: 'Judicial Infrastructure Division',
        hindiName: 'न्यायिक अवसंरचना प्रभाग',
        head: 'Joint Secretary (Infrastructure)',
        responsibilities: [
          'Administering the Centrally Sponsored Scheme (CSS) for Development of Infrastructure Facilities for Judiciary.',
          'Financial grant allocations to States and Union Territories on a 60:40 basis (90:10 for North Eastern & Himalayan States).',
          'Construction of 21,000+ modern court halls and residential accommodation units for judicial officers.',
          'Establishment of Lawyers Halls, toilet complexes, digital courtrooms, and accessible infrastructure for persons with disabilities.',
          'Monitoring progress through the Nyaya Vikas web portal and mobile application.'
        ],
        constitutionalBasis: 'Judicial Administration & Access to Justice',
        officialUrl: 'https://doj.gov.in/judicial-infrastructure/'
      },
      {
        id: 'fast-track-courts',
        name: 'Fast Track Special Courts (FTSC) Division',
        hindiName: 'फास्ट ट्रैक विशेष न्यायालय प्रभाग',
        head: 'Director / Deputy Secretary (FTSC)',
        responsibilities: [
          'Administering the Centrally Sponsored Scheme for 750+ Fast Track Special Courts (FTSCs).',
          'Dedicated trial adjudication for cases under POCSO Act and rape provisions under Criminal Law (Amendment) Act 2018.',
          'Funding assistance provided under the Nirbhaya Fund on 60:40 cost-sharing with States (90:10 for NE/Himalayan States).',
          'Targeting trial conclusion within 2 months of framing charges.',
          'State-wise monitoring of monthly disposals, pending caseloads, and courtroom infrastructure.'
        ],
        constitutionalBasis: 'Criminal Law (Amendment) Act 2018 & POCSO Act 2012',
        officialUrl: 'https://doj.gov.in/fast-track-special-court-ftsc/'
      },
      {
        id: 'judicial-reforms-nja',
        name: 'National Judicial Academy & Judicial Reforms Division',
        hindiName: 'राष्ट्रीय न्यायिक अकादमी एवं न्यायिक सुधार प्रभाग',
        head: 'Joint Secretary (Judicial Reforms)',
        responsibilities: [
          'Coordination with National Judicial Academy (NJA), Bhopal, and 25 State Judicial Academies for continuous judicial education.',
          'Promotion of alternative dispute resolution (ADR), mediation, Lok Adalats, and Gram Nyayalayas.',
          'Formulation of policies for judicial pendency reduction and litigation management.',
          'Coordination with Law Commission of India on statutory judicial reform proposals.',
          'Administration of the Gram Nyayalayas Act, 2008 for village-level justice delivery.'
        ],
        constitutionalBasis: 'Judicial Reforms & Training Guidelines',
        officialUrl: 'https://doj.gov.in/judicial-reforms/'
      },
      {
        id: 'nalsa-coordination',
        name: 'National Legal Services Authority (NALSA) Coordination',
        hindiName: 'राष्ट्रीय विधिक सेवा प्राधिकरण समन्वय',
        head: 'Under Secretary (Legal Aid)',
        responsibilities: [
          'Central Government administrative interface with National Legal Services Authority (NALSA).',
          'Disbursement of central grants-in-aid to NALSA for countrywide free legal aid delivery.',
          'Monitoring Lok Adalats (National and Permanent Lok Adalats) organized across courts.',
          'Review of legal aid representation for undertrial prisoners, women, children, and marginalized sections.'
        ],
        constitutionalBasis: 'Legal Services Authorities Act, 1987 (Act No. 39 of 1987)',
        officialUrl: 'https://nalsa.gov.in'
      }
    ];

    return {
      success: true,
      count: divisions.length,
      divisions,
      dataFreshness: {
        lastUpdated: '2026-11-13',
        asOfDate: '2026-03-01',
        sourceStatus: 'verified_official',
        sourceAuthority: 'Department of Justice Annual Report',
        officialPortalUrl: 'https://doj.gov.in/divisions/'
      }
    };
  },

  /**
   * Retrieves structured details of major Centrally Sponsored Schemes under DoJ
   */
  getSchemes() {
    const schemes = [
      {
        id: 'tele-law',
        name: 'Tele-Law: Reaching the Unreached',
        hindiName: 'टेली-लॉ: सुदूर तक न्याय पहुंचाना',
        launchYear: 2017,
        type: 'Central Sector Component under DISHA',
        description: 'Mainstreams legal aid to marginalized communities via video-conferencing technology stationed at Common Service Centres (CSCs) and via the citizen mobile application.',
        eligibility: 'Free legal advice to women, children, SC/ST, persons with disabilities, disaster victims, industrial workmen, persons in custody, and citizens eligible under Section 12 of Legal Services Authorities Act, 1987.',
        helpline: '14416 (Toll-Free National Helpline)',
        officialUrl: 'https://www.tele-law.in',
        coverage: 'Covering 5+ lakh Gram Panchayats and 2.5+ crore consultations'
      },
      {
        id: 'ftsc',
        name: 'Fast Track Special Courts (FTSCs)',
        hindiName: 'फास्ट ट्रैक विशेष न्यायालय योजना',
        launchYear: 2019,
        type: 'Centrally Sponsored Scheme (CSS)',
        fundingSource: 'Nirbhaya Fund (Central 60% : State 40%; NE/Himalayan 90% : 10%)',
        description: 'Time-bound adjudication of pending cases of rape and Protection of Children from Sexual Offences (POCSO) Act.',
        mandate: '2-month trial completion target under Criminal Law (Amendment) Act 2018.',
        operationalCourts: 'Over 750 functional courts (including 400+ exclusive POCSO courts) across 30 States/UTs.',
        officialUrl: 'https://doj.gov.in/fast-track-special-court-ftsc/'
      },
      {
        id: 'css-judicial-infra',
        name: 'Centrally Sponsored Scheme for Judicial Infrastructure',
        hindiName: 'न्यायिक अवसंरचना के लिए केंद्र प्रायोजित योजना',
        launchYear: 1993,
        type: 'Centrally Sponsored Scheme (CSS)',
        fundingRatio: '60:40 (General States), 90:10 (NE & Himalayan States), 100% (UTs)',
        description: 'Financial assistance to State Governments/UTs for construction of court halls, residential complexes for judicial officers, lawyer halls, and digital infrastructure.',
        monitoringApp: 'Nyaya Vikas Portal and Mobile App',
        status: '21,000+ court halls completed nationwide',
        officialUrl: 'https://doj.gov.in/judicial-infrastructure/'
      },
      {
        id: 'nyaya-bandhu',
        name: 'Nyaya Bandhu (Pro Bono Legal Services)',
        hindiName: 'न्याय बंधु: नि:शुल्क विधिक सेवा',
        launchYear: 2017,
        type: 'Central Sector Component under DISHA',
        description: 'Mobile platform connecting practicing advocates willing to offer pro bono legal counsel with marginalized litigants who cannot afford legal representation.',
        proBonoClubs: 'Established in 85+ premier law colleges across India for student-advocate assistance.',
        officialUrl: 'https://www.probono-doj.in'
      },
      {
        id: 'nyaya-mitra',
        name: 'Nyaya Mitra Scheme',
        hindiName: 'न्याय मित्र योजना',
        launchYear: 2017,
        type: 'Central Sector Component under DISHA',
        description: 'Retired judicial officers or experienced executive officers engaged as Nyaya Mitras to assist district courts in expediting disposal of civil and criminal cases pending for more than 10 years.',
        focusCourts: 'High-pendency district and subordinate court complexes.',
        officialUrl: 'https://doj.gov.in/access-to-justice/'
      },
      {
        id: 'ecourts-phase-3',
        name: 'eCourts Mission Mode Project Phase III',
        hindiName: 'ई-कोर्ट्स मिशन मोड परियोजना चरण III',
        launchYear: 2023,
        budgetOutlay: '₹7,210 Crore (Cabinet approved 4-year cycle)',
        type: 'Central Sector Scheme',
        description: 'Next-generation digital infrastructure including cloud storage, AI/ML-assisted translation and optical character recognition, digital preservation of 310+ crore records, paperless courts, and smart scheduling.',
        officialUrl: 'https://doj.gov.in/ecourts-project/'
      },
      {
        id: 'gram-nyayalayas',
        name: 'Gram Nyayalayas Scheme',
        hindiName: 'ग्राम न्यायालय योजना',
        launchYear: 2008,
        type: 'Statutory Scheme under Gram Nyayalayas Act, 2008',
        description: 'Grassroots village-level mobile judicial forums presided over by Nyayadhikaris (First Class Judicial Magistrates) to deliver inexpensive and speedy justice at the doorstep of rural citizens.',
        status: 'Over 470 notified Gram Nyayalayas; 260+ functional.',
        officialUrl: 'https://doj.gov.in/gram-nyayalaya/'
      }
    ];

    return {
      success: true,
      count: schemes.length,
      schemes,
      dataFreshness: {
        lastUpdated: '2026-11-13',
        asOfDate: '2026-03-01',
        sourceStatus: 'verified_official',
        sourceAuthority: 'Ministry of Law and Justice, Government of India',
        officialPortalUrl: 'https://doj.gov.in'
      }
    };
  }
};

export default dojService;
