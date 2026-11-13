import { Scale, Phone, Mail, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#0a1f44] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-[#ff9933] rounded-full p-1.5">
                <Scale className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">JusticeAI</span>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed">
              AI-powered citizen assistance portal for the Department of Justice,
              Ministry of Law &amp; Justice, Government of India.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-[#ff9933] mb-3 text-sm uppercase tracking-wider">
              Official Links
            </h4>
            <ul className="space-y-2 text-sm text-blue-200">
              {[
                { label: 'Department of Justice', href: 'https://doj.gov.in' },
                { label: 'eCourts Services', href: 'https://ecourts.gov.in' },
                { label: 'NJDG', href: 'https://njdg.ecourts.gov.in' },
                { label: 'eTribunals', href: 'https://etribunals.gov.in' },
                { label: 'Tele-Law', href: 'https://tele-law.in' },
              ].map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#ff9933] flex items-center gap-1 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-[#ff9933] mb-3 text-sm uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-blue-200">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#ff9933]" />
                1800-11-7000 (Helpline)
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#ff9933]" />
                helpdesk@doj.gov.in
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1a3f7c] mt-8 pt-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-blue-300">
          <span>© 2026 Department of Justice, Government of India. All rights reserved.</span>
          <span>Content is indicative · Verify at official sources</span>
        </div>
      </div>
    </footer>
  )
}
