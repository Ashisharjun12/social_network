import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-dark/90 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-12">
        {/* Main Content */}
        <div className="flex flex-col items-center text-center mb-8">
          <h3 className="text-3xl font-bold gradient-text mb-4">AnonSocial</h3>
          <p className="text-gray-400 text-sm max-w-md mb-6">
            Your safe space to express yourself freely and anonymously.
          </p>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-6">
            <FooterLink href="/about" text="About" />
            <FooterLink href="/privacy" text="Privacy" />
            <FooterLink href="/terms" text="Terms" />
            <FooterLink href="/help" text="Help" />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-400 text-sm">
            © 2024 AnonSocial. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-400">🔒 100% Anonymous</span>
            <span className="text-sm text-gray-400">⚡ 24/7 Support</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, text }: { href: string; text: string }) {
  return (
    <a href={href} className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
      {text}
    </a>
  )
} 