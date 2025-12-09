// data/projects.ts

// 1. Define the TypeScript Interface (Blueprint) for a Single Project
export interface Project {
  id: number;
  slug: string; // Used for the URL (e.g., /projects/my-first-project)
  title: string;
  shortDescription: string; // Used in the main project listing page
  technologies: string[]; // List of technologies (React, Tailwind, Node.js)
  imageUrl: string; // Path to your project image (e.g., /images/project1.png)
  githubUrl: string;
  liveUrl?: string; // Optional: Some projects might not have a live demo
  // Full description content will be added later for the individual project page
}

// 2. Create the Array of Projects
export const PROJECTS: Project[] = [
  {
    id: 1,
    slug: 'e-commerce-dashboard',
    title: 'E-commerce Admin Dashboard',
    shortDescription: 'A responsive full-stack dashboard for managing orders, users, and inventory.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
    imageUrl: '/images/ecommerce-dash.jpg', // You'll put this image in your /public folder
    githubUrl: 'https://github.com/yourname/ecommerce-dashboard',
    liveUrl: 'https://dashboard.example.com',
  },
  {
    id: 2,
    slug: 'personal-blog',
    title: 'Personal Dev Blog',
    shortDescription: 'A static-generated blog focused on modern web development tutorials.',
    technologies: ['Next.js', 'MDX', 'Sass'],
    imageUrl: '/images/dev-blog.jpg',
    githubUrl: 'https://github.com/yourname/dev-blog',
    liveUrl: 'https://blog.example.com',
  },
  {
    id: 3,
    slug: 'weather-app',
    title: 'Real-Time Weather App',
    shortDescription: 'Fetches and displays real-time weather data from the OpenWeatherMap API.',
    technologies: ['React', 'JavaScript', 'Custom CSS', 'REST API'],
    imageUrl: '/images/weather-app.jpg',
    githubUrl: 'https://github.com/yourname/weather-app',
  },
];