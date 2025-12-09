// app/projects/[slug]/page.tsx - FINAL ANIMATED CLIENT COMPONENT (Hydration Fix Assumed)

"use client"; // <-- CRITICAL FIX: Enables client-side execution for framer-motion

import { PROJECTS, Project } from '@/data/projects';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { motion, Variants } from 'framer-motion'; 


// --- ANIMATION VARIANTS (Typed for stability) ---

const mainEntrance: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
        opacity: 1, 
        y: 0, 
        transition: { 
            duration: 0.7, 
            staggerChildren: 0.1, 
            ease: "easeOut"
        } 
    },
};

const item: Variants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};


// 1. Define the props interface to include the dynamic parameter (slug)
interface ProjectDetailPageProps {
  params: {
    slug: string;
  };
}

// 2. Component to render the detailed page (NOW A CLIENT COMPONENT)
export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  // Find the project that matches the URL slug
  const project = PROJECTS.find(p => p.slug === params.slug);

  // If the project doesn't exist, show the Next.js 404 page
  if (!project) {
    notFound(); 
  }

  // Define the detailed content (which you'll fill in later)
  const fullDescription = 
    "This is where the detailed case study goes. Discuss the challenge, the process (design, coding), and the results/lessons learned. Use paragraphs, headings (h2/h3), and bullet points to break up the text!";

  return (
    // motion.div is now valid and will execute the animation
    <motion.div
        variants={mainEntrance}
        initial="initial"
        animate="animate"
        key={project.slug} // Ensures animation reruns cleanly on slug change
        className="container mx-auto p-8 pt-32 text-gray-900" 
    >
        {/* Back Button */}
        <motion.div variants={item}>
            <Link 
                href="/projects" 
                className="text-indigo-600 hover:text-indigo-800 mb-6 inline-block font-semibold"
            >
                <span>← Back to all Projects</span>
            </Link>
        </motion.div>

        {/* Title and Overview */}
        <motion.h1 
            className="text-5xl font-extrabold text-gray-900 mb-2"
            variants={item}
        >
            {project.title}
        </motion.h1>
        <motion.p 
            className="text-xl text-gray-600 mb-8"
            variants={item}
        >
            {project.shortDescription}
        </motion.p>

        {/* Main Image */}
        <motion.div 
            className="relative h-96 w-full mb-8 rounded-lg overflow-hidden shadow-xl"
            variants={item}
        >
            <Image 
                src={project.imageUrl}
                alt={`Main view of ${project.title}`}
                fill 
                style={{ objectFit: 'cover' }}
                priority
            />
        </motion.div>
        
        {/* Case Study Content and Tech Stack Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Full Description / Case Study (2/3 width) */}
            <motion.div 
                className="lg:col-span-2 prose max-w-none"
                variants={item}
            >
                <h2 className="text-3xl font-bold mb-4">Project Overview & Approach</h2>
                <p className="text-gray-700">{fullDescription}</p>
                
                {/* Action Links */}
                <div className="flex space-x-6 mt-6">
                    <a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                    >
                        View Code on GitHub
                    </a>
                    {project.liveUrl && (
                        <a 
                            href={project.liveUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                        >
                            Launch Live Demo
                        </a>
                    )}
                </div>
            </motion.div>

            {/* Tech Stack Sidebar (1/3 width) */}
            <motion.aside 
                className="lg:col-span-1 bg-gray-50 p-6 rounded-lg shadow-inner h-fit"
                variants={item}
            >
                <h3 className="text-2xl font-bold mb-4 border-b pb-2 text-gray-800">Key Technologies</h3>
                <ul className="space-y-2">
                    {project.technologies.map(tech => (
                        <li key={tech} className="text-gray-700">
                            <span className="font-semibold mr-2">•</span> {tech}
                        </li>
                    ))}
                </ul>
            </motion.aside>
        </div>
    </motion.div>
  );
}