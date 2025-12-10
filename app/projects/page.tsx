// app/projects/page.tsx - FINAL MINIMALIST VERSION WITH ANIMATIONS

"use client";

import { PROJECTS } from '@/data/projects'; 
import ProjectCard from '@/components/ProjectCard'; 
import { motion, Variants } from 'framer-motion';

// --- ANIMATION VARIANTS (unchanged) ---
const container: Variants = { /* ... */ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } }, };
const item: Variants = { /* ... */ hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }, };


export default function ProjectsPage() {
    // Determine if there are only a few projects (less than 6 for a 3-column layout)
    const isShortPage = PROJECTS.length <= 6; 
    
    return (
        <div className="container mx-auto p-8 pt-32">
            {/* Header, Text, and Project Grid (unchanged) */}
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-5xl font-extrabold text-center text-white mb-4"
            >
                My Work & Projects
            </motion.h1>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-center text-sky-400 max-w-3xl mx-auto mb-16"
            >
                A curated selection of solutions built using modern technologies.
            </motion.p>

            <motion.div
                variants={container}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
            >
                {
                    PROJECTS.map((project) => (
                        <motion.div 
                            key={project.id} 
                            variants={item} 
                        >
                            <ProjectCard project={project} />
                        </motion.div>
                    ))
                }
            </motion.div>
            
            {/* 🚨 CRITICAL FIX: DYNAMICALLY ADD EXTRA VERTICAL SPACE 
                This element ensures the content area is at least the full viewport 
                height to properly push the footer down via the parent's flex-grow.
            */}
            {isShortPage && (
                <div className="h-0 min-h-[calc(100vh-600px)]"></div>
            )}
            
            {/* Standard bottom padding (can be reduced now) */}
            <div className="pb-24"></div> 
        </div>
    );
}