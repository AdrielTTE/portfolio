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
    slug: 'Habitect',
    title: 'Habitect',
    shortDescription: 'A habit tracking mobile application to help keep track of all your habits',
    technologies: ['Flutter', 'Dart'],
    imageUrl: '/images/habitects.png',
    githubUrl: 'https://github.com/AdrielTTE/Habitect',

  },
  {
    id: 2,
    slug: 'Package Tracker',
    title: 'Package Tracker',
    shortDescription: 'A package tracking web application for customers, admins, and delivery drivers',
    technologies: ['Laravel', 'PHP', 'MySQL'],
    imageUrl: '/images/dev-blog.jpg',
    githubUrl: 'https://github.com/AdrielTTE/Integrative-Programming-Assignment',
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