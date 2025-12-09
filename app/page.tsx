// app/page.tsx - FINAL COHESIVE VERSION

"use client"; // Essential for using Framer Motion

import Image from 'next/image';
import { motion } from 'framer-motion'; 

export default function Home() {
  return (
    // 1. Structural Fix: Added pt-24 (or pt-32, depending on Navbar height) to clear the floating Navbar
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh)] p-8 pt-24 text-gray-100">
      
      {/* 2. Motion for Image - Material Border & Subtle Hover */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        // Border uses the primary Sky Blue color
        className="relative w-48 h-48 rounded-full overflow-hidden mb-6 shadow-xl border-4 border-sky-600 transition-transform duration-500 hover:scale-105 hover:rotate-3"
      >
        <Image 
          src="/images/tempProfile.jpg"
          alt="Adriel Tang Thien Ern - Profile Picture"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </motion.div>

      {/* 3. Motion for Text - Slides in slightly later */}
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        // Main text is bold white
        className="text-6xl font-extrabold text-white mb-2 text-center"
      >
        Hi! I'm Adriel
      </motion.h1>

      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        // Sub-headline uses the eye-catching Sky Blue accent
        className="text-3xl text-sky-500 font-medium mb-6 text-center"
      >
        Full Stack Development | Application Deployment
      </motion.h2>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        // Body text is soft gray for good contrast against the dark background
        className="text-lg text-gray-300 max-w-2xl text-center mb-8"
      >
        Building modern, high-performance web applications with a focus on clean code and accessibility. Explore my projects to see my work in action.
      </motion.p>
      
      {/* 4. Motion for Button - Material Design Styling */}
      <motion.a 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        href="/projects"
        className="
          // Primary color (Sky Blue) background
          px-8 py-3 bg-sky-600 text-white text-xl font-semibold 
          
          // Material Geometry (Pill shape) and Elevation
          rounded-full shadow-lg 
          
          // Intentional Motion/Feedback
          hover:bg-sky-500 hover:shadow-xl active:bg-sky-700 
          transition-all duration-200 active:scale-95 focus:ring-4 focus:ring-sky-500 focus:ring-opacity-50
        "
      >
        View My Projects
      </motion.a>
      
    </div>
  );
}