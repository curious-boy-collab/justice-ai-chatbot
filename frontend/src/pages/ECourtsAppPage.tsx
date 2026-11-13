import {
  Smartphone, ArrowLeft, ExternalLink, Bell,
  Search, FileText, Download, MessageSquare,
  Phone, CheckCircle, Info
} from 'lucide-react'
import Footer from '../components/Layout/Footer'

interface ECourtsAppPageProps {
  onBack: () => void
  onStartChat: (query?: string) => void
}

const features = [
  {
    icon: Search,
    title: 'CNR Number Search',
    titleHi: 'CNR नंबर से खोजें',
    description: 'Search case status using the unique 16-digit Case Number Record (CNR) number.',
  },
  {
    icon: Bell,
    title: 'Hearing Date Alerts',
    titleHi: 'सुनवाई तिथि अलर्ट',
    description: 'Get push notifications for upcoming hearing dates and case status changes.',
  },
  {
    icon: FileText,
    title: 'Cause Lists & Daily Orders',
    titleHi: 'कॉज़ लिस्ट और दैनिक आदेश',
    description: 'View daily cause lists and download court orders in PDF format.',
  },
  {
    icon: MessageSquare,
    title: 'Case History & Proceedings',
    titleHi: 'केस इतिहास और कार्यवाही',
    description: 'Complete case history with all proceedings, adjournment details, and orders.',
  },
]

const searchMethods = [
  { method: 'CNR Number', description: '16-digit unique case identifier — most accurate method', example: 'e.g., DLNE010012342024' },
  { method: 'Party Name', description: 'Search by petitioner or respondent name', example: 'e.g., "Ramesh Kumar vs State"' },
  { method: 'Advocate Name', description: 'Search by advocate enrollment number or name', example: 'e.g., Adv. Priya Sharma' },
  { method: 'FIR Number', description: 'Search by FIR number, police station and year', example: 'e.g., FIR 123/2024, PS Saket' },
  { method: 'Case Number', description: 'Search by case type, number and year', example: 'e.g., CS 456/2024' },
]

export default function ECourtsAppPage({ onBack, onStartChat }: ECourtsAppPageProps) {
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
            <div className="bg-sky-600 rounded-xl p-3 flex-shrink-0">
              <Smartphone className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">eCourts Services App</h1>
              <p className="text-blue-200 text-sm mt-1">
                Track cases, get hearing alerts and access court services from your mobile
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Download section */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-[#0a1f44] mb-4 flex items-center gap-2">
            <Download className="w-5 h-5 text-[#ff9933]" /> Download eCourts Services App
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="https://play.google.com/store/apps/details?id=in.gov.ecourts.eCourtsServices"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-[#f8fafd] rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow group"
            >
              <div className="bg-green-100 p-3 rounded-lg">
                <Smartphone className="w-6 h-6 text-[#138808]" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-[#0a1f44] text-sm">Google Play Store</div>
                <div className="text-xs text-gray-500">Android — Free download</div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#ff9933] transition-colors" />
            </a>
            <a
              href="https://apps.apple.com/in/app/ecourts-services/id1424985624"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-[#f8fafd] rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow group"
            >
              <div className="bg-blue-100 p-3 rounded-lg">
                <Smartphone className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-[#0a1f44] text-sm">Apple App Store</div>
                <div className="text-xs text-gray-500">iOS — Free download</div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#ff9933] transition-colors" />
            </a>
          </div>
        </div>

        {/* Key features */}
        <div>
          <h2 className="text-lg font-bold text-[#0a1f44] mb-4">Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-[#f0f4fb] rounded-lg">
                      <Icon className="w-5 h-5 text-[#0a1f44]" />
                    </div>
                    <div>
                      <div className="font-bold text-[#0a1f44] text-sm">{feature.title}</div>
                      <div className="text-xs text-[#ff9933] font-medium">{feature.titleHi}</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Search methods */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-[#0a1f44]">Case Search Methods</h2>
            <p className="text-xs text-gray-400 mt-0.5">Multiple ways to find your case on the eCourts platform</p>
          </div>
          <div className="divide-y divide-gray-50">
            {searchMethods.map((item) => (
              <div key={item.method} className="px-6 py-4 hover:bg-[#f8fafd] transition-colors">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#138808] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-[#0a1f44] text-sm">{item.method}</div>
                    <div className="text-sm text-gray-600">{item.description}</div>
                    <div className="text-xs text-gray-400 mt-0.5 font-mono">{item.example}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SMS & IVR services */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-100 rounded-xl p-5">
            <h3 className="font-bold text-green-800 text-sm mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> SMS Case Status Service
            </h3>
            <p className="text-sm text-green-700 mb-3">
              Send an SMS to check case status without internet. Works on basic phones too.
            </p>
            <div className="bg-white rounded-lg p-4 border border-green-100">
              <div className="text-xs text-gray-500 mb-1">SMS Format:</div>
              <div className="font-mono font-bold text-[#0a1f44]">ECOURTS &lt;CNR Number&gt;</div>
              <div className="text-xs text-gray-500 mt-2">Send to:</div>
              <div className="font-mono font-bold text-[#138808] text-lg">9766899899</div>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
            <h3 className="font-bold text-blue-800 text-sm mb-3 flex items-center gap-2">
              <Phone className="w-4 h-4" /> IVR Helpline
            </h3>
            <p className="text-sm text-blue-700 mb-3">
              Call the toll-free IVR number for voice-based case status and court information.
            </p>
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="text-xs text-gray-500 mb-1">Toll-Free IVR:</div>
              <div className="font-mono font-bold text-[#0a1f44] text-lg">1800-200-0498</div>
              <div className="text-xs text-gray-500 mt-2">Available 24/7 across India</div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex gap-3">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-blue-800 text-sm mb-1">About eCourts Mission Mode Project</div>
            <p className="text-sm text-blue-700">
              The eCourts project is a Pan-India initiative under the Department of Justice for ICT enablement
              of courts across the country. Phase III aims to provide a seamless, paperless, and intelligent
              court experience with AI-assisted case management.
            </p>
            <a
              href="https://ecourts.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline font-semibold"
            >
              <ExternalLink className="w-3 h-3" />
              ecourts.gov.in — Official eCourts Portal
            </a>
          </div>
        </div>

        {/* Chat CTA */}
        <div className="bg-[#0a1f44] rounded-xl p-6 text-white text-center">
          <h2 className="font-bold text-lg mb-2">Need help with the eCourts app?</h2>
          <p className="text-blue-200 text-sm mb-4">Ask JusticeAI for step-by-step guidance on using app features.</p>
          <button
            onClick={() => onStartChat('How do I download and use the eCourts mobile app?')}
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
