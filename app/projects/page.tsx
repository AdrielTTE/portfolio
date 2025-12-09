
import { PROJECTS } from '@/data/projects'; 
import ProjectCard from '@/components/ProjectCard';
 

export default function ProjectsPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-12">
        My Work & Projects
      </h1>

      {/* Grid Layout for Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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
      
    </div>
  );
}