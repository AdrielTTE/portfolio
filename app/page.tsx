// app/page.tsx - FINAL MINIMALIST VERSION synchronized with About Page Button Design

"use client";

import Image from 'next/image';
// Import Transition type here for explicit typing
import { motion, Transition } from 'framer-motion'; 

// Define a unified, minimal ease. 
// Explicitly type it as a partial Transition object to resolve the TS error.
const minimalTransition: Partial<Transition> = {
    ease: "easeOut", // Use a smooth, non-bouncy easing function
};

export default function Home() {
    return (
        // Minimalist: Dark background (zinc-950) for stark contrast, generous padding
        <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh)] p-8 pt-24 bg-zinc-950 text-gray-50">
            
            {/* Subtle background element for the blur filter to sample (Sky/Blue adjusted) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-sky-800/50 rounded-full blur-3xl opacity-30 z-0"></div>
            
            {/* 1. Image - Minimal Opacity & Scale */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }} 
                className="relative w-48 h-48 rounded-lg overflow-hidden mb-8 
                    border border-zinc-700 transition-transform duration-300 hover:scale-[1.02] z-10"
            >
                <Image 
                    src="/images/tempProfile.jpg"
                    alt="Adriel Tang Thien Ern - Profile Picture"
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                />
            </motion.div>

            {/* 2. Main Title - Minimal Y-Axis Shift and Opacity */}
            <motion.h1 
                initial={{ opacity: 0, y: 5 }} // Very small shift
                animate={{ opacity: 1, y: 0 }}
                // Uses the explicitly typed spread
                transition={{ ...minimalTransition, duration: 0.4, delay: 0.1 }}
                className="text-6xl font-light text-white mb-2 text-center z-10"
            >
                Adriel Tang
            </motion.h1>

            {/* 3. Sub-Headline - Sky-400 for consistency */}
            <motion.h2 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                // Uses the explicitly typed spread
                transition={{ ...minimalTransition, duration: 0.4, delay: 0.2 }}
                className="text-2xl text-sky-400 font-normal tracking-wider uppercase mb-8 text-center z-10"
            >
                Full Stack Developer
            </motion.h2>

            {/* 4. Body Text - Pure Fade-In */}
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                className="text-lg text-gray-400 max-w-xl text-center mb-12 leading-relaxed z-10"
            >
                Building modern, high-performance web applications with a focus on **clean code** and **accessible interfaces**. Explore my work.
            </motion.p>
            
            {/* 5. Button - SYNCHRONIZED TO NAVBAR ACTIVE STATE (And Error Fixed) */}
            <motion.a 
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }}
                // Uses the explicitly typed spread
                transition={{ ...minimalTransition, duration: 0.3, delay: 0.5 }}
                href="/projects"
                className="
                    // SYNCHRONIZED STYLES: Matches Navbar Active Button
                    inline-block px-6 py-3 text-lg font-medium rounded-full transition-all duration-300 ease-in-out
                    bg-sky-600 text-white shadow-lg shadow-sky-900/50 hover:bg-sky-500 active:bg-sky-700 z-10
                "
            >
                View Projects
            </motion.a>
            
        </div>
    );
}