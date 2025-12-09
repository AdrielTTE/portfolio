// components/Footer.tsx - FINAL GLASSMORPHISM VERSION

import React from 'react';
import { FaLinkedin, FaGithub } from 'react-icons/fa'; 

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    // 🚀 KEY CHANGE: Applied bg-white/5 and backdrop-blur-sm for the frosted glass effect
    <footer className="w-full bg-white/5 backdrop-blur-sm mt-auto py-8 border-t border-white/20">
      <div className="container mx-auto px-8 flex flex-col md:flex-row justify-between items-center text-gray-400">
        
        {/* Copyright and Name */}
        <p className="text-sm order-2 md:order-1 mt-4 md:mt-0">
          © {currentYear} Adriel Tang. All rights reserved.
        </p>

        {/* Social Links */}
        <div className="flex space-x-6 order-1 md:order-2">
          
          {/* LinkedIn Link */}
          <a 
            href="https://www.linkedin.com/in/adriel-tang-6a5a941a0/"
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-sky-500 transition-colors duration-200"
            aria-label="LinkedIn Profile"
          >
            <FaLinkedin size={24} />
          </a>

          {/* GitHub Link */}
          <a 
            href="https://github.com/AdrielTTE"
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-sky-500 transition-colors duration-200"
            aria-label="GitHub Profile"
          >
            <FaGithub size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
}