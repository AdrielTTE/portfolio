// components/ProjectCard.tsx - FINAL GLASSMORPHISM VERSION

import Link from 'next/link';
import Image from 'next/image';
import type { Project } from '@/data/projects'; 

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const projectDetailUrl = `/projects/${project.slug}`;

  return (
    
    <div className="bg-white/5 backdrop-blur-sm rounded-xl shadow-2xl hover:shadow-sky-500/30 transition-shadow duration-300 overflow-hidden border border-white/10">
      
      {/* Project Image */}
      <div className="relative h-48 w-full">
        <Image 
          src={project.imageUrl}
          alt={`Screenshot of ${project.title}`}
          fill 
          style={{ objectFit: 'cover' }} 
          className="transition-transform duration-500 hover:scale-105"
        />
      </div>

      <div className="p-6">
        {/* Project Title (Linked to Detail Page) */}
        <h2 className="text-2xl font-bold text-white mb-2">
          {/* Link uses Sky Blue hover for interactivity */}
          <Link href={projectDetailUrl} className="hover:text-sky-400 transition-colors duration-200">
            {project.title}
          </Link>
        </h2>

        {/* Short Description */}
        <p className="text-gray-300 mb-4">{project.shortDescription}</p>

        {/* Technologies List - Muted but visible accents */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech) => (
            <span 
              key={tech} 
              // Muted dark background for the pill, Sky Blue text
              className="px-3 py-1 text-xs font-medium bg-white/10 text-sky-400 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action Links */}
        <div className="flex space-x-4 pt-2 border-t border-white/20">
          <a 
            href={project.githubUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            // Link color is Sky Blue
            className="text-sky-500 hover:text-sky-400 font-semibold transition-colors duration-200"
          >
            GitHub Repo →
          </a>
          {project.liveUrl && (
            <a 
              href={project.liveUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              // Subtle accent color for live link
              className="text-green-400 hover:text-green-300 font-semibold transition-colors duration-200"
            >
              Live Demo →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}