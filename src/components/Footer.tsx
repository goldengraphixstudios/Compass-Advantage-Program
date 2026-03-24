import Link from "next/link";

const logo = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/compass-logo.png`;

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white relative overflow-hidden">
      {/* Top gradient line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.03]"
        style={{ background: "radial-gradient(circle, #00AEEF 0%, transparent 70%)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <img
              src={logo}
              alt="Compass Title & Escrow"
              width={200}
              height={50}
              className="h-12 w-auto mb-5 brightness-0 invert"
            />
            <p className="text-blue-200/50 text-sm leading-relaxed max-w-xs">
              The Compass Advantage Program helps promote your listings through our established marketing channels — free for all agents.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-5 text-white text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#how-it-works" className="text-blue-200/50 hover:text-cyan-300 transition-colors duration-200 flex items-center gap-2">
                  <svg className="w-3 h-3 text-cyan-500/50" fill="currentColor" viewBox="0 0 6 10"><path d="M1.4.2l4 4.5a.4.4 0 010 .6l-4 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  How It Works
                </a>
              </li>
              <li>
                <a href="#benefits" className="text-blue-200/50 hover:text-cyan-300 transition-colors duration-200 flex items-center gap-2">
                  <svg className="w-3 h-3 text-cyan-500/50" fill="currentColor" viewBox="0 0 6 10"><path d="M1.4.2l4 4.5a.4.4 0 010 .6l-4 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  Benefits
                </a>
              </li>
              <li>
                <a href="#form-section" className="text-blue-200/50 hover:text-cyan-300 transition-colors duration-200 flex items-center gap-2">
                  <svg className="w-3 h-3 text-cyan-500/50" fill="currentColor" viewBox="0 0 6 10"><path d="M1.4.2l4 4.5a.4.4 0 010 .6l-4 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  Submit a Listing
                </a>
              </li>
              <li>
                <Link href="/submissions" className="text-blue-200/50 hover:text-cyan-300 transition-colors duration-200 flex items-center gap-2">
                  <svg className="w-3 h-3 text-cyan-500/50" fill="currentColor" viewBox="0 0 6 10"><path d="M1.4.2l4 4.5a.4.4 0 010 .6l-4 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  Track Submission
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-5 text-white text-sm uppercase tracking-wider">Need Help?</h4>
            <div className="space-y-5">
              <div>
                <p className="font-medium text-white text-sm">Jenna Faioli</p>
                <p className="text-blue-200/40 text-xs mb-1">Brand Manager</p>
                <a
                  href="mailto:jfaioli@compasste.com"
                  className="text-cyan-400/80 hover:text-cyan-300 transition-colors duration-200 text-sm inline-flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  jfaioli@compasste.com
                </a>
              </div>
              <div>
                <p className="font-medium text-white text-sm">Anthony M. Bettencourt</p>
                <p className="text-blue-200/40 text-xs mb-1">Managing Director</p>
                <a
                  href="mailto:abettencourt@compasste.com"
                  className="text-cyan-400/80 hover:text-cyan-300 transition-colors duration-200 text-sm inline-flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  abettencourt@compasste.com
                </a>
              </div>
            </div>
          </div>

          {/* Social / CTA */}
          <div>
            <h4 className="font-semibold mb-5 text-white text-sm uppercase tracking-wider">Get Started</h4>
            <p className="text-blue-200/50 text-sm leading-relaxed mb-5">
              Ready to promote your next listing? Submit your details and let us handle the rest.
            </p>
            <a
              href="#form-section"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-cyan-400 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:from-cyan-400 hover:to-cyan-300 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer"
            >
              Submit a Listing
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-blue-200/30">
            &copy; {new Date().getFullYear()} Compass Title & Escrow, Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-blue-200/20 uppercase tracking-widest">Compass Advantage Program</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
