// app/projects/[slug]/page.tsx

import { PROJECTS, Project } from '@/data/projects';
import Image from 'next/image';
import { notFound } from 'next/navigation';


// 1. Define the props interface to include the dynamic parameter (slug)
interface ProjectDetailPageProps {
  params: {
    slug: string;
  };
}

// 2. Component to render the detailed page
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
    <div className="container mx-auto p-8">
      {/* Back Button (Optional but helpful) */}
      <a href="/projects" className="text-indigo-600 hover:text-indigo-800 mb-6 inline-block font-semibold">
        ← Back to all Projects
      </a>

      {/* Title and Overview */}
      <h1 className="text-5xl font-extrabold text-gray-900 mb-2">{project.title}</h1>
      <p className="text-xl text-gray-600 mb-8">{project.shortDescription}</p>

      {/* Main Image */}
      <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden shadow-xl">
        <Image 
          src={project.imageUrl}
          alt={`Main view of ${project.title}`}
          fill 
          style={{ objectFit: 'cover' }}
        />
      </div>
      
      {/* Case Study Content and Tech Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Full Description / Case Study (2/3 width) */}
        <div className="lg:col-span-2 prose max-w-none">
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
        </div>

        {/* Tech Stack Sidebar (1/3 width) */}
        <aside className="lg:col-span-1 bg-gray-50 p-6 rounded-lg shadow-inner h-fit">
          <h3 className="text-2xl font-bold mb-4 border-b pb-2 text-gray-800">Key Technologies</h3>
          <ul className="space-y-2">
            {project.technologies.map(tech => (
              <li key={tech} className="text-gray-700">
                <span className="font-semibold mr-2">•</span> {tech}
              </li>
            ))}
          </ul>
        </aside>

      </div>
    </div>
  );
}