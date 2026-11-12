import {
  Phone, ArrowLeft, ExternalLink, Users, MapPin,
  CheckCircle, AlertTriangle, Clock, Video, Headphones
} from 'lucide-react'

interface TeleLawPageProps {
  onBack: () => void
  onStartChat: (query?: string) => void
}

const eligibility = [
  { group: 'Women', description: 'All women citizens, irrespective of income', free: true },
  { group: 'SC/ST Communities', description: 'Members of Scheduled Castes and Scheduled Tribes', free: true },
  { group: 'BPL Families', description: 'Families below the poverty line with BPL card', free: true },
  { group: 'Persons with Disabilities', description: 'Citizens with physical or mental disabilities', free: true },
  { group: 'Children', description: 'Minors requiring legal protection or guidance', free: true },
  { group: 'Other Citizens', description: 'General citizens above the income threshold', free: false },
]

const howItWorks = [
  {
    step: 1,
    title: 'Visit Your Nearest CSC',
    description: 'Go to any Common Service Centre. Over 5,00,000 CSCs operate across India including rural areas.',
    icon: MapPin,
  },
  {
    step: 2,
    title: 'Register for Tele-Law',
    description: 'The CSC operator registers you on the Tele-Law portal. Aadhaar or valid ID is required.',
    icon: Users,
  },
  {
    step: 3,
    title: 'Schedule a Consultation',
    description: 'Choose a date and time for your legal consultation. Video, audio, and phone options available.',
    icon: Clock,
  },
  {
    step: 4,
    title: 'Connect with a Lawyer',
    description: 'Speak with a Panel Lawyer via video conference at the CSC. Consultations are in your preferred language.',
    icon: Video,
  },
]

export default function TeleLawPage({ onBack, onStartChat }: TeleLawPageProps) {
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
            <div className="bg-purple-600 rounded-xl p-3 flex-shrink-0">
              <Phone className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Tele-Law Services</h1>
              <p className="text-blue-200 text-sm mt-1">
                Free legal consultation for marginalised citizens via Common Service Centres
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Key info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center">
            <Headphones className="w-8 h-8 text-[#ff9933] mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#0a1f44]">5,00,000+</div>
            <div className="text-sm text-gray-500">Common Service Centres</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center">
            <Phone className="w-8 h-8 text-[#138808] mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#0a1f44]">FREE</div>
            <div className="text-sm text-gray-500">For eligible citizens</div>
            <div className="text-xs text-gray-400 mt-1">₹30 for others</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center">
            <Video className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#0a1f44]">Video + Audio</div>
            <div className="text-sm text-gray-500">Consultation modes</div>
          </div>
        </div>

        {/* How it works */}
        <div>
          <h2 className="text-lg font-bold text-[#0a1f44] mb-6">How to Access Tele-Law</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {howItWorks.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.step} className="flex gap-4 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#0a1f44] text-white flex items-center justify-center font-bold text-sm">
                      {item.step}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-[#ff9933]" />
                      <h3 className="font-bold text-[#0a1f44] text-sm">{item.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Eligibility */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-[#0a1f44]">Eligibility & Fees</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Tele-Law is FREE for marginalised groups under the DoJ mandate
            </p>
          </div>
          <div className="divide-y divide-gray-50">
            {eligibility.map((item) => (
              <div key={item.group} className="flex items-center justify-between px-6 py-3 hover:bg-[#f8fafd] transition-colors">
                <div>
                  <div className="font-medium text-[#0a1f44] text-sm">{item.group}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
                {item.free ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-[#138808] bg-green-50 border border-green-100 px-3 py-1 rounded-full">
                    <CheckCircle className="w-3 h-3" /> FREE
                  </span>
                ) : (
                  <span className="text-xs font-bold text-[#ff9933] bg-orange-50 border border-orange-100 px-3 py-1 rounded-full">
                    ₹30 per session
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Helplines */}
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-5">
          <h2 className="font-bold text-purple-800 text-sm mb-4">📞 Helpline Numbers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <div className="text-2xl font-bold text-[#0a1f44]">1800-200-7514</div>
              <div className="text-xs text-gray-500 mt-1">Tele-Law Toll-Free Helpline</div>
              <div className="text-xs text-purple-600 mt-0.5">Available Mon–Sat, 9 AM to 6 PM</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <div className="text-2xl font-bold text-[#0a1f44]">14416</div>
              <div className="text-xs text-gray-500 mt-1">Short Code for Tele-Law</div>
              <div className="text-xs text-purple-600 mt-0.5">Dial from any phone across India</div>
            </div>
          </div>
        </div>

        {/* Demo data notice */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0" />
          <p className="text-orange-700 text-sm">
            <strong>Note:</strong> CSC count and service availability data are illustrative. Check official portals for current information.
          </p>
        </div>

        {/* Official links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href="https://tele-law.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow group"
          >
            <div className="bg-purple-100 p-3 rounded-lg">
              <Phone className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-[#0a1f44] text-sm">Official Tele-Law Portal</div>
              <div className="text-xs text-gray-500">tele-law.in</div>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#ff9933] transition-colors" />
          </a>
          <a
            href="https://locator.csccloud.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow group"
          >
            <div className="bg-blue-100 p-3 rounded-lg">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-[#0a1f44] text-sm">Find Nearest CSC</div>
              <div className="text-xs text-gray-500">locator.csccloud.in</div>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#ff9933] transition-colors" />
          </a>
        </div>

        {/* Chat CTA */}
        <div className="bg-[#0a1f44] rounded-xl p-6 text-white text-center">
          <h2 className="font-bold text-lg mb-2">Need legal assistance?</h2>
          <p className="text-blue-200 text-sm mb-4">Ask JusticeAI about Tele-Law eligibility, nearest CSC, or how to book a consultation.</p>
          <button
            onClick={() => onStartChat('How can I access Tele-Law services?')}
            className="inline-flex items-center gap-2 bg-[#ff9933] hover:bg-[#e8871a] text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
          >
            Ask JusticeAI
          </button>
        </div>
      </div>
    </div>
  )
}
