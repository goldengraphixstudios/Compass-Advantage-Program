import Link from "next/link";

const logo = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/compass-logo.png`;

export default function Footer() {
  return (
    <footer className="bg-navy-600 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <img src={logo} alt="Compass Title & Escrow" width={200} height={50} className="h-12 w-auto mb-4 brightness-0 invert" />
            <p className="text-blue-200/70 text-sm leading-relaxed">
              The Compass Advantage Program helps promote your listings through our established marketing channels.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-cyan-300">Quick Links</h4>
            <ul className="space-y-2 text-sm text-blue-200/70">
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#form-section" className="hover:text-white transition-colors">Submit a Listing</a></li>
              <li><Link href="/submissions" className="hover:text-white transition-colors">Track Submission</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-cyan-300">Need Help?</h4>
            <div className="space-y-3 text-sm text-blue-200/70">
              <div>
                <p className="font-medium text-white">Jenna Faioli</p>
                <p>Brand Manager</p>
                <a href="mailto:jfaioli@compasste.com" className="text-cyan-300 hover:text-cyan-200 transition-colors">
                  jfaioli@compasste.com
                </a>
              </div>
              <div>
                <p className="font-medium text-white">Anthony M. Bettencourt</p>
                <p>Managing Director</p>
                <a href="mailto:abettencourt@compasste.com" className="text-cyan-300 hover:text-cyan-200 transition-colors">
                  abettencourt@compasste.com
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-8 text-center text-xs text-blue-200/40">
          &copy; {new Date().getFullYear()} Compass Title & Escrow, Ltd. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
