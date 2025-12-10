// app/page.tsx - FINAL MINIMALIST VERSION with ALIGNMENT FIX

"use client";

import Image from 'next/image';
import { motion, Transition } from 'framer-motion'; 
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';

const minimalTransition: Partial<Transition> = {
    ease: "easeOut",
};

const GITHUB_URL = "https://github.com/AdrielTTE";
const LINKEDIN_URL = "https://www.linkedin.com/in/adriel-tang-6a5a941a0/";

export default function Home() {
    return (
        // Outer container remains the same, ensuring full viewport height
        <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh)] p-8 pt-24 bg-zinc-950 text-gray-50">
            
            {/* Background blur element (unchanged) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-sky-800/50 rounded-full blur-3xl opacity-30 z-0"></div>
            
            {/* 1. Image - Margin reduced to 'mb-4' */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }} 
                className="relative w-48 h-48 rounded-lg overflow-hidden **mb-4**                     border border-zinc-700 transition-transform duration-300 hover:scale-[1.02] z-10"
            >
                <Image 
                    src="/images/tempProfile.jpg"
                    alt="Adriel Tang Thien Ern - Profile Picture"
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                />
            </motion.div>

            {/* 🚨 NEW: Content Wrapper with explicit vertical gaps */}
            <div className="flex flex-col items-center gap-y-4"> 

                {/* 2. Main Title - Margin REMOVED */}
                <motion.h1 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...minimalTransition, duration: 0.4, delay: 0.1 }}
                    className="text-5xl font-extrabold mb-5 text-white **text-center** z-10 pt-7" // mb-2 removed
                >
                    Adriel Tang
                </motion.h1>

                {/* 3. Sub-Headline - Margin REMOVED */}
                <motion.h2 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...minimalTransition, duration: 0.4, delay: 0.2 }}
                    className="text-2xl text-sky-400 font-normal tracking-wider uppercase **text-center** z-10" // mb-4 removed
                >
                    Full Stack Developer
                </motion.h2>

                {/* Social Icon Buttons - Now contained within the new gap structure */}
                <div className="flex space-x-6 z-10"> 
                    

                    {/* LinkedIn Button */}
                    <motion.a
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...minimalTransition, duration: 0.4, delay: 0.4 }}
                        href={LINKEDIN_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn Profile"
                        className="p-3 rounded-full text-white bg-blue-700/80 hover:bg-blue-600/80 transition-colors shadow-xl"
                    >
                        <FaLinkedinIn size={24} />
                    </motion.a>

                    {/* GitHub Button */}
                    <motion.a
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...minimalTransition, duration: 0.4, delay: 0.3 }}
                        href={GITHUB_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub Profile"
                        className="p-3 rounded-full text-white bg-zinc-800/80 hover:bg-zinc-700/80 transition-colors shadow-xl"
                    >
                        <FaGithub size={24} />
                    </motion.a>
                </div>


                {/* 4. Body Text - Margin adjusted to 'mb-0' */}
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                    className="text-lg text-gray-400 max-w-xl text-center leading-relaxed z-10 **mt-4**" // mb-12 removed, replaced with mt-4 for separation
                >
                    Building structured, high-performance web applications with a focus on clean code and accessible interfaces. Explore my work.
                </motion.p>
                
                {/* 5. Button - Now outside the gap-Y container for proper spacing with P tag */}
                <motion.a 
                    initial={{ opacity: 0, scale: 0.98 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ ...minimalTransition, duration: 0.3, delay: 0.7 }}
                    href="/about"
                    className="
                        inline-block px-6 py-3 text-lg font-medium rounded-full transition-all duration-300 ease-in-out
                        bg-sky-600 text-white shadow-lg shadow-sky-900/50 hover:bg-sky-500 active:bg-sky-700 z-10
                    "
                >
                    Who Am I?
                </motion.a>
            
            {/* 🚨 END: Content Wrapper */}
            </div> 
            
        </div>
    );
}