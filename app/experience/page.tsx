// app/experience/page.tsx - Cleaned Page Logic

"use client";
import { motion, Variants } from 'framer-motion';

// --- Imports from Refactored Files ---
import SkillCard, { cardStaggerItem } from '@/components/SkillCard'; // Importing component and its animation
import { timelineData, technicalSkills } from '@/data/experienceData'; // Importing all data

// ====================================================================
// 1. ANIMATION VARIANTS (Kept for Page Layout)
// ====================================================================

// Standard scroll-reveal for large sections
const scrollReveal: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" },
    },
};

// Staggered container for card grids (Kept for layout control)
const cardStaggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.07, 
            delayChildren: 0.1,    
        },
    },
};


// ====================================================================
// 2. MAIN PAGE COMPONENT
// ====================================================================

export default function ExperiencePage() {
    return (
        <div className="container mx-auto p-8 pt-32 text-gray-100 space-y-24">

            {/* Title for the new page */}
            <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl font-extrabold text-white mb-20 text-center"
            >
                My Journey & Technical Stack
            </motion.h1>

            {/* SECTION 1: EDUCATION & CAREER PATH - Timeline */}
            <motion.div
                variants={scrollReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <h2 className="text-3xl font-bold mb-8 border-b border-zinc-700 pb-3 text-sky-400">
                    Education & Career Path 🎓
                </h2>
                <div className="relative pl-6 sm:pl-10 pb-4">
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-zinc-700 sm:left-6"></div>

                    {timelineData.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true, amount: 0.5 }}
                            className="mb-8 relative p-4 rounded-lg bg-zinc-900/20 hover:bg-zinc-900/30 transition-colors duration-300"
                        >
                            <div className={`absolute -left-1.5 sm:left-4 -translate-x-1/2 mt-2 w-4 h-4 rounded-full border-2 border-sky-600 ${item.iconColor} bg-zinc-900`}></div>

                            <div className="ml-0 sm:ml-8">
                                <p className="text-sm font-light text-gray-400 mb-1">{item.date}</p>
                                <h3 className="text-xl font-extrabold text-white mb-1">{item.title}</h3>
                                <p className="text-md font-medium text-sky-400 mb-2">{item.institution}</p>
                                <p className="text-gray-300">{item.details}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>


            {/* SECTION 2: TECHNICAL EXPERTISE - Glassmorphism Container with Cards */}
            <motion.div
                variants={scrollReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="p-10 rounded-xl bg-zinc-900/30 backdrop-blur-md shadow-xl ring-1 ring-inset ring-white/10"
            >
                <h2 className="text-3xl font-bold mb-10 border-b border-zinc-700 pb-3 text-sky-400">
                    Technical Expertise 🛠️
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-12">
                    
                    {/* COLUMN 1: Frameworks & Libraries */}
                    <motion.div 
                        variants={cardStaggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        className="border-l-4 border-sky-600 pl-4"
                    >
                        <h3 className="text-2xl font-bold text-sky-400 mb-6">Frameworks & Libraries</h3>
                        <div className="grid gap-6">
                            {technicalSkills.frameworks.map((skill, index) => (
                                <SkillCard key={index} {...skill} />
                            ))}
                        </div>
                    </motion.div>

                    {/* COLUMN 2: Languages */}
                    <motion.div 
                        variants={cardStaggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        className="border-l-4 border-sky-600 pl-4"
                    >
                        <h3 className="text-2xl font-bold text-sky-400 mb-6">Languages</h3>
                        <div className="grid gap-6">
                            {technicalSkills.languages.map((skill, index) => (
                                <SkillCard key={index} {...skill} />
                            ))}
                        </div>
                    </motion.div>

                    {/* COLUMN 3: Tools & Data */}
                    <motion.div 
                        variants={cardStaggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        className="border-l-4 border-sky-600 pl-4"
                    >
                        <h3 className="text-2xl font-bold text-sky-400 mb-6">Tools & Data</h3>
                        <div className="grid gap-6">
                            {technicalSkills.toolsAndData.map((skill, index) => (
                                <SkillCard key={index} {...skill} />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Final CTA (Connect to Contact Page AND Projects Page) */}
<div className="text-center pt-12 pb-24">
    <div className="flex justify-center space-x-6">
       
        <a
            href="/projects"
            className="inline-block px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 ease-in-out
                bg-sky-600 text-white shadow-xl shadow-sky-900/50 hover:bg-sky-500 active:bg-sky-700"
                >
            View Projects
        </a>
        <a
            href="/contact"
            className="inline-block px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 ease-in-out
                border-2 border-sky-600 text-sky-400 hover:bg-sky-600 hover:text-white"
        >
            Ready to Start a Project? Contact Me
        </a>
        {/* Secondary Button: View Projects - FIX APPLIED HERE */}
        
    </div>
</div>
        </div>
    );
}