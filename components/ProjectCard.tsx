// components/ProjectCard.tsx
import Link from 'next/link';
import Image from 'next/image';
// Import the Project type definition from your data file
import type { Project } from '@/data/projects';

// Define the component props using the Project interface
interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  // Construct the URL for the individual project details page
  const projectDetailUrl = `/projects/${project.slug}`;

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
      
      {/* Project Image - Ensure your images are in public/images/ */}
      <div className="relative h-48 w-full">
        <Image 
          src={project.imageUrl}
          alt={`Screenshot of ${project.title}`}
          fill // Makes the image fill the parent div
          style={{ objectFit: 'cover' }} // Ensures the image covers the area nicely
          className="transition-transform duration-500 hover:scale-105"
        />
      </div>

      <div className="p-6">
        {/* Project Title (Linked to Detail Page) */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          <Link href={projectDetailUrl} className="hover:text-indigo-600 transition-colors">
            {project.title}
          </Link>
        </h2>

        {/* Short Description */}
        <p className="text-gray-600 mb-4">{project.shortDescription}</p>

        {/* Technologies List */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech) => (
            <span 
              key={tech} 
              className="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action Links */}
        <div className="flex space-x-4">
          <a 
            href={project.githubUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            GitHub Repo
          </a>
          {project.liveUrl && (
            <a 
              href={project.liveUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-green-600 hover:text-green-800 font-semibold"
            >
              Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}