// components/Navbar.tsx

"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation'; 

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact', 'href': '/contact' },
];

export default function Navbar() {
  const pathname = usePathname(); 

  return (
    // 1. KEY CHANGE: Use bg-opacity for transparency + backdrop-blur for frosting
    // We lift it slightly off the edge with top-2 and use rounded-full
    <nav className="fixed w-[calc(100%-48px)] max-w-7xl top-5 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300">
      
      {/* Container for the Glass Effect */}
      <div className="bg-white/5 backdrop-blur-md shadow-2xl rounded-full p-2">
        <div className="flex justify-between items-center px-4">
          
          {/* Logo/Name - Smaller text, higher impact font weight */}
          <Link 
            href="/" 
            className="text-gray-100 text-2xl font-black hover:text-sky-400 transition-colors duration-200"
          >
            ADRIEL TANG
          </Link>
          
          {/* Navigation Links */}
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link 
                  key={item.label}
                  href={item.href}
                  scroll={true} 
                  className={`
                    // Minimalist design: Uses primary color for text hover, not background hover
                    px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 
                    ${isActive 
                      // Active: Sky background, strong shadow
                      ? 'bg-sky-600 text-white shadow-lg' 
                      // Inactive: Transparent background, white text, sky hover
                      : 'text-gray-100 hover:text-sky-400 hover:bg-white/10' 
                    }
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}