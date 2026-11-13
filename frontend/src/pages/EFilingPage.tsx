import {
  FileText, CreditCard, ArrowLeft, ExternalLink,
  CheckCircle, Info, Smartphone,
  ShieldCheck, ChevronDown, ChevronUp
} from 'lucide-react'
import { useState } from 'react'
import Footer from '../components/Layout/Footer'

interface EFilingPageProps {
  onBack: () => void
  onStartChat: (query?: string) => void
}

const steps = [
  {
    number: 1,
    title: 'Register on eFiling Portal',
    titleHi: 'ई-फाइलिंग पोर्टल पर पंजीकरण',
    description: 'Visit filing.ecourts.gov.in and create your account using Aadhaar or mobile number verification. Advocates use Bar Council enrollment number.',
    icon: Smartphone,
  },
  {
    number: 2,
    title: 'Select Court & Case Type',
    titleHi: 'न्यायालय और केस प्रकार चुनें',
    description: 'Choose the appropriate court (District, High Court, or Tribunal), select the case type (Civil Suit, Criminal, Writ Petition, etc.) and enter party details.',
    icon: FileText,
  },
  {
    number: 3,
    title: 'Upload Documents',
    titleHi: 'दस्तावेज़ अपलोड करें',
    description: 'Upload the plaint/petition, supporting documents, vakalatnama, and required annexures in PDF format. Maximum file size: 50MB per document.',
    icon: FileText,
  },
  {
    number: 4,
    title: 'Sign Using e-Sign or DSC',
    titleHi: 'ई-साइन या DSC से हस्ताक्षर',
    description: 'Digitally sign all documents using Aadhaar e-Sign (OTP-based) or a Digital Signature Certificate (DSC). Aadhaar e-Sign is free for litigants.',
    icon: ShieldCheck,
  },
  {
    number: 5,
    title: 'Pay Court Fees via ePay',
    titleHi: 'ePay के माध्यम से कोर्ट फीस भुगतान',
    description: 'Pay court fees through the integrated ePay portal (pay.ecourts.gov.in). Supported methods: UPI, Net Banking, and RuPay Debit Card.',
    icon: CreditCard,
  },
  {
    number: 6,
    title: 'Submit & Get eFiling Number',
    titleHi: 'जमा करें और ई-फाइलिंग नंबर प्राप्त करें',
    description: 'After successful payment, submit the filing. You will receive an eFiling number and can track the case through the eCourts portal.',
    icon: CheckCircle,
  },
]

const faqs = [
  {
    q: 'Who can use eFiling?',
    a: 'Advocates enrolled with Bar Councils, litigants (party-in-person), authorized representatives, and government lawyers can use the eFiling system.',
  },
  {
    q: 'What documents are required?',
    a: 'Plaint or Petition, Vakalatnama (if filed through advocate), supporting affidavits, court fee payment receipt, and any relevant annexures in PDF format.',
  },
  {
    q: 'Is Aadhaar mandatory for eFiling?',
    a: 'Aadhaar is required for e-Sign verification. If you do not have Aadhaar, you can use a Digital Signature Certificate (DSC) instead.',
  },
  {
    q: 'What payment methods are accepted for ePay?',
    a: 'ePay supports UPI (BHIM, Google Pay, PhonePe, etc.), Net Banking (major banks), and RuPay Debit Cards. Credit cards and international cards are NOT accepted.',
  },
  {
    q: 'Can I file cases in Hindi or regional languages?',
    a: 'Yes, the eFiling system supports filing in the official language of the respective court. Uploaded documents can be in English, Hindi, or the regional language accepted by the court.',
  },
  {
    q: 'What happens after eFiling?',
    a: 'After successful eFiling, the filing is verified by the court. If accepted, a Case Number (CNR) is allotted. If defects are found, the filer is notified to correct and re-submit.',
  },
]

export default function EFilingPage({ onBack, onStartChat }: EFilingPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-[#f8fafd]">
      {/* Header */}
      <div className="bg-[#0a1f44] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </button>
          <div className="flex items-start gap-4">
            <div className="bg-[#138808] rounded-xl p-3 flex-shrink-0">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">eFiling & ePay Guide</h1>
              <p className="text-blue-200 text-sm mt-1">
                Step-by-step guide to file court cases and pay fees online
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Portal links strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href="https://filing.ecourts.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow group"
          >
            <div className="bg-green-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-[#138808]" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-[#0a1f44] text-sm">eFiling Portal</div>
              <div className="text-xs text-gray-500">filing.ecourts.gov.in</div>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#ff9933] transition-colors" />
          </a>
          <a
            href="https://pay.ecourts.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow group"
          >
            <div className="bg-orange-100 p-3 rounded-lg">
              <CreditCard className="w-6 h-6 text-[#ff9933]" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-[#0a1f44] text-sm">ePay Portal</div>
              <div className="text-xs text-gray-500">pay.ecourts.gov.in</div>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#ff9933] transition-colors" />
          </a>
        </div>

        {/* Step-by-step procedure */}
        <div>
          <h2 className="text-lg font-bold text-[#0a1f44] mb-6">How to File a Case Online</h2>
          <div className="space-y-4">
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <div key={step.number} className="flex gap-4">
                  {/* Step number */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#0a1f44] text-white flex items-center justify-center font-bold text-sm">
                      {step.number}
                    </div>
                    {step.number < 6 && <div className="w-0.5 flex-1 bg-gray-200 mt-2" />}
                  </div>
                  {/* Step content */}
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex-1 mb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-[#0a1f44]" />
                      <h3 className="font-bold text-[#0a1f44] text-sm">{step.title}</h3>
                    </div>
                    <div className="text-xs text-[#ff9933] font-medium mb-2">{step.titleHi}</div>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Payment methods info */}
        <div className="bg-green-50 border border-green-100 rounded-xl p-5 flex gap-3">
          <CreditCard className="w-5 h-5 text-[#138808] flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-green-800 text-sm mb-1">Accepted Payment Methods (ePay)</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
              {[
                { method: 'UPI', desc: 'BHIM, Google Pay, PhonePe, Paytm' },
                { method: 'Net Banking', desc: 'All major scheduled banks' },
                { method: 'RuPay Debit Card', desc: 'Domestic RuPay cards only' },
              ].map((pm) => (
                <div key={pm.method} className="bg-white rounded-lg p-3 border border-green-100">
                  <div className="font-semibold text-[#0a1f44] text-xs">{pm.method}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{pm.desc}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-green-700 mt-3">
              <strong>Note:</strong> Credit cards and international cards are NOT accepted. Payment receipts are generated instantly after successful transaction.
            </p>
          </div>
        </div>

        {/* e-Sign info */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex gap-3">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-blue-800 text-sm mb-1">About e-Sign & Digital Signature</div>
            <p className="text-sm text-blue-700">
              <strong>Aadhaar e-Sign:</strong> Free, OTP-based signing linked to your Aadhaar. Requires active mobile number registered with Aadhaar. Most litigants use this method.
            </p>
            <p className="text-sm text-blue-700 mt-2">
              <strong>DSC (Digital Signature Certificate):</strong> A USB token-based certificate issued by certified agencies (eMudhra, Sify, etc.). Required for some High Court and Tribunal filings. Costs ₹500–₹2,000 for 2 years.
            </p>
          </div>
        </div>

        {/* FAQs */}
        <div>
          <h2 className="text-lg font-bold text-[#0a1f44] mb-4">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#f8fafd] transition-colors"
                >
                  <span className="font-semibold text-[#0a1f44] text-sm">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-gray-600 border-t border-gray-50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat CTA */}
        <div className="bg-[#0a1f44] rounded-xl p-6 text-white text-center">
          <h2 className="font-bold text-lg mb-2">Need help with eFiling?</h2>
          <p className="text-blue-200 text-sm mb-4">Ask JusticeAI for step-by-step guidance tailored to your case.</p>
          <button
            onClick={() => onStartChat('How do I file a case using eFiling and ePay?')}
            className="inline-flex items-center gap-2 bg-[#ff9933] hover:bg-[#e8871a] text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
          >
            Ask JusticeAI
          </button>
        </div>
      </div>
      <Footer />
    </div>
  )
}
