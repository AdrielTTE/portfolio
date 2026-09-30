// Typed data for /about: bio, timeline, skills and the music paragraph.
// Source: docs/copy.md section 3, reconciled with facts confirmed after that
// draft (Bantu2U start month, AV venue). See docs/open-items.md.

export interface TimelineItem {
  start: string;
  end: string; // 'now' for the current role
  role: string;
  org: string;
  note?: string;
}

export interface SkillGroup {
  name: string;
  items: string[];
}

export const heroRoleLine = 'Full stack developer in Kuala Lumpur, working at Bantu2U Holdings.';

export const bio = [
  "I'm a full stack developer based in Kuala Lumpur, Malaysia. My main tools are ASP.NET Core and C# for web apps and backend APIs, SQL for designing and managing the databases behind them, and Flutter and Dart for cross-platform mobile apps. I've also built with Laravel, Node.js, Next.js, and Astro. I take on freelance projects: web apps, APIs and databases, mobile apps, and the occasional business website.",
  'I completed a Bachelor of Information Technology (Honours) in Software Systems Development at TAR UMT in April 2026, with First Class Honours, CGPA 3.78. I joined Bantu2U Holdings as a Software Development Executive Intern in October 2025 and now work there full-time as a Software Developer, developing in-house software.',
];

export const timeline: TimelineItem[] = [
  {
    start: 'May 2026',
    end: 'now',
    role: 'Software Developer',
    org: 'Bantu2U Holdings Sdn Bhd',
    note: 'Developing in-house software.',
  },
  {
    start: 'October 2025',
    end: 'April 2026',
    role: 'Software Development Executive Intern',
    org: 'Bantu2U Holdings Sdn Bhd',
    note: 'Developing in-house software.',
  },
  {
    start: 'June 2023',
    end: 'April 2026',
    role: 'Bachelor of Information Technology (Honours) in Software Systems Development',
    org: 'Tunku Abdul Rahman University of Management and Technology (TAR UMT)',
    note: 'First Class Honours, CGPA 3.78.',
  },
];

export const skills: SkillGroup[] = [
  {
    name: 'Main stack',
    items: ['ASP.NET Core', 'C#', 'REST APIs', 'SQL', 'Database design and management', 'Flutter', 'Dart'],
  },
  {
    name: 'Also used',
    items: ['Laravel', 'PHP', 'Node.js', 'Next.js', 'React', 'Astro', 'Tailwind CSS'],
  },
  {
    name: 'Other languages',
    items: ['TypeScript', 'JavaScript', 'Java', 'Python', 'C++'],
  },
  {
    name: 'Data & tools',
    items: ['SQL Server', 'MySQL', 'Firebase', 'Git', 'GitHub', 'Unit and integration testing', 'HTML5', 'CSS3', 'npm', 'Yarn'],
  },
];

export const musicParagraph =
  'Outside development, I have 8 years of experience in audio and visual (AV) production, including 2 years as an AV coordinator at Emmanuel EFC, and 7 years performing live music on guitar, both ongoing.';

export const photoAlt =
  "Adriel Tang playing acoustic guitar with a capo on the fretboard, seated in a black shirt during a live performance, with another musician visible behind him.";
