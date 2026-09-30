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
  "I'm a full stack developer based in Kuala Lumpur, Malaysia. I work across web and mobile: React and Next.js on the front end, Node.js, ASP.NET Core, and Laravel on the back end, and Flutter for cross-platform apps. I also take on freelance projects: business websites, web apps, and mobile apps.",
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
    name: 'Frameworks & libraries',
    items: ['Next.js', 'React', 'Flutter', 'Dart', 'ASP.NET Core', 'Node.js', 'Tailwind CSS', 'Laravel'],
  },
  {
    name: 'Languages',
    items: ['TypeScript', 'C#', 'Java', 'Python', 'JavaScript', 'C++'],
  },
  {
    name: 'Tools & data',
    items: ['MySQL', 'SQL Server', 'Git', 'GitHub', 'Unit and integration testing', 'HTML5', 'CSS3', 'REST APIs', 'npm', 'Yarn'],
  },
];

export const musicParagraph =
  'Outside development, I have 8 years of experience in audio and visual (AV) production, including 2 years as an AV coordinator at Emmanuel EFC, and 7 years performing live music on guitar, both ongoing.';

export const photoAlt =
  "Adriel Tang playing acoustic guitar with a capo on the fretboard, seated in a black shirt during a live performance, with another musician visible behind him.";
