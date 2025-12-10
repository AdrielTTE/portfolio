// data/experienceData.ts - Centralized Data for Experience and Skills

import {
    DiReact, DiNodejs, DiDotnet, DiGit, DiMysql, DiSqllite,
    DiJava, DiPython, DiHtml5, DiCss3,
} from 'react-icons/di';
import {
    SiNextdotjs, SiFlutter, SiTailwindcss, SiTypescript, SiJavascript,
    SiDart, SiCplusplus, SiSharp, SiLaravel, SiJest, SiGithub, SiNodedotjs,
} from 'react-icons/si';

// Data for the Timeline section
export const timelineData = [
    {
        title: 'Bachelor of Information Technology (Honours) in Software Systems Development',
        institution: 'Tunku Abdul Rahman University of Management and Technology, TAR UMT',
        date: ' June 2023 - 2026 (Expected)',
        details: 'Specialized in Software Engineering and Application Development. Graduated with First Class Honours (3.78 CGPA).',
        iconColor: 'text-sky-500',
    },
    {
        title: 'Software Development Executive Intern',
        institution: 'Bantu2U Holdings Sdn Bhd',
        date: 'October 2025 - Present',
        details: 'Focused on developing and deploying both web and mobile applications, and managing RESTful API services.',
        iconColor: 'text-sky-400',
    },
];

// Data for the Technical Skills section
export const technicalSkills = {
    frameworks: [
        { Icon: SiNextdotjs, title: 'Next.js / React', details: 'High-performance component-based UI and full-stack architecture.', iconColor: 'text-white' },
        { Icon: SiFlutter, title: 'Flutter / Dart', details: 'Cross-platform mobile, web, and desktop apps.', iconColor: 'text-blue-500' },
        { Icon: DiDotnet, title: 'ASP.NET Core', details: 'Backend resilience using C# for MVC, APIs, and microservices.', iconColor: 'text-purple-600' },
        { Icon: DiNodejs, title: 'Node.js', details: 'Scalable backend services and RESTful APIs.', iconColor: 'text-green-500' },
        { Icon: SiTailwindcss, title: 'Tailwind CSS', details: 'Rapid, utility-first styling for responsive design.', iconColor: 'text-cyan-400' },
        { Icon: SiLaravel, title: 'Laravel MVC', details: 'Full-featured PHP framework for structured web apps.', iconColor: 'text-red-500' },
    ],
    languages: [
        { Icon: SiTypescript, title: 'TypeScript', details: 'Primary language for robust, scalable, and type-safe development.', iconColor: 'text-blue-500' },
        { Icon: SiSharp, title: 'C# / .NET', details: 'Enterprise backend development and application logic.', iconColor: 'text-purple-600' },
        { Icon: DiJava, title: 'Java', details: 'OOP principles for desktop and enterprise systems.', iconColor: 'text-orange-500' },
        { Icon: DiPython, title: 'Python', details: 'Scripting, data processing, and rapid prototyping.', iconColor: 'text-yellow-400' },
        { Icon: SiJavascript, title: 'JavaScript (ES6+)', details: 'Foundation for all modern web and Node.js development.', iconColor: 'text-yellow-500' },
        { Icon: SiCplusplus, title: 'C++', details: 'Systems programming and performance-critical logic.', iconColor: 'text-blue-600' },
    ],
    toolsAndData: [
        { Icon: DiMysql, title: 'MySQL / SQL Server', details: 'Designing, querying, and optimizing database schemas.', iconColor: 'text-blue-400' },
        { Icon: DiGit, title: 'Git / GitHub', details: 'Version control best practices and collaborative coding.', iconColor: 'text-orange-600' },
        { Icon: SiJest, title: 'Testing / TDD', details: 'Unit and integration testing for reliable features.', iconColor: 'text-red-500' },
        { Icon: DiHtml5, title: 'HTML5 / CSS3', details: 'Core mastery of modern web structure and presentation.', iconColor: 'text-orange-600' },
        { Icon: DiSqllite, title: 'RESTful API', details: 'Designing clean, documented, and state-of-the-art APIs.', iconColor: 'text-blue-300' },
        { Icon: SiNodedotjs, title: 'NPM / Yarn', details: 'Managing project dependencies and build toolchains.', iconColor: 'text-green-500' },
    ],
};

// Interface for SkillCardProps (moved here for consistency)
export interface SkillCardProps {
    Icon: React.ElementType;
    title: string;
    details: string;
    iconColor: string;
}