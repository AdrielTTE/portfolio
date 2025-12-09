// app/projects/page.tsx - FINAL MINIMALIST VERSION WITH ANIMATIONS

"use client"; // <-- CRITICAL: Reverting to Client Component to use framer-motion

import { PROJECTS } from '@/data/projects'; 
import ProjectCard from '@/components/ProjectCard'; 
import { motion, Variants } from 'framer-motion'; // <-- Import motion and Variants

// --- ANIMATION VARIANTS ---

// Container variant controls the sequence and stagger of child items
const container: Variants = {
    hidden: {}, 
    visible: {
        transition: {
            staggerChildren: 0.1, // Delay between each child animation
            delayChildren: 0.2,   // Initial delay for the first card
        },
    },
};

// Item variant defines how each ProjectCard will animate (slide up and fade in)
const item: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};


export default function ProjectsPage() {
    return (
        // 1. Add pt-32 padding to clear the floating Navbar
        <div className="container mx-auto p-8 pt-32">
            
            {/* Header - Animated text for smooth entrance */}
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

            {/* Grid Layout for Project Cards - Animation Triggered On Load */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="visible" // <-- Triggers animation immediately on mount
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
            >
                {
                    // Loop through the imported PROJECTS array
                    PROJECTS.map((project) => (
                        <motion.div // <-- Wrap each card in motion.div
                            key={project.id} 
                            variants={item} // <-- Apply the item animation variant
                        >
                            <ProjectCard 
                                project={project} 
                            />
                        </motion.div>
                    ))
                }
            </motion.div>
            
            {/* Bottom padding for clearance */}
            <div className="pb-24"></div>
        </div>
    );
}