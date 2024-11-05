import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Header() {
  return (
    <header className="bg-gray-900 text-white shadow-lg">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <a href="/" className="text-2xl font-bold">
            AnonSocial
          </a>
          
          <div className="flex gap-4">
            <a 
              href="/feed" 
              className="hover:text-blue-400 transition-colors"
            >
              Feed
            </a>
            <a 
              href="/groups" 
              className="hover:text-blue-400 transition-colors"
            >
              Groups
            </a>
          </div>
        </div>
      </nav>
    </header>
  )
} 