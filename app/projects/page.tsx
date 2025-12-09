// app/projects/page.tsx - FINAL MINIMALIST VERSION

import { PROJECTS } from '@/data/projects'; 
import ProjectCard from '@/components/ProjectCard'; 
// Note: This page does not need "use client" as it only fetches data and renders components.

export default function ProjectsPage() {
  return (
    // 1. Add pt-32 padding to clear the floating Navbar
    <div className="container mx-auto p-8 pt-32">
      
      {/* Header - Use White/Sky Blue accent colors for high contrast */}
      <h1 className="text-5xl font-extrabold text-center text-white mb-4">
        My Work & Projects
      </h1>
      <p className="text-xl text-center text-sky-400 max-w-3xl mx-auto mb-16">
        A curated selection of solutions built using modern technologies.
      </p>

      {/* Grid Layout for Project Cards - Increased gap for more negative space */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {
          // Loop through the imported PROJECTS array
          PROJECTS.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
            />
          ))
        }
      </div>
      
      {/* Bottom padding for clearance */}
      <div className="pb-24"></div>
    </div>
  );
}