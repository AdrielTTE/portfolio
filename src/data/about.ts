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
  "I'm a full stack developer in Kuala Lumpur. I build with ASP.NET Core and C# for web apps and APIs, SQL for the databases behind them, and Flutter and Dart for mobile apps. Applied Theory is where I apply what I've learned from studying and researching to real-life projects, and I'm getting my own apps ready for Google Play under that name, starting with Crest, which is in closed testing.",
  'I graduated in Software Systems Development from TAR UMT with First Class Honours in April 2026, and I now work full-time as a Software Developer at Bantu2U Holdings.',
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
    items: ['ASP.NET Core', 'C#', 'REST APIs', 'SQL', 'Flutter', 'Dart'],
  },
  {
    name: 'Mobile app release',
    items: [
      'Google Play Console',
      'App signing and Android App Bundles',
      'Closed testing tracks',
      'Store listing and privacy policy',
      'Automated release builds (GitHub Actions)',
    ],
  },
  {
    name: 'Also used',
    items: ['TypeScript', 'Laravel', 'Node.js', 'Next.js', 'Astro', 'SQL Server', 'MySQL', 'Firebase', 'Git'],
  },
];

export const musicParagraph =
  'Outside development, I have 8 years of experience in audio and visual (AV) production, including 2 years as an AV coordinator at Emmanuel EFC, and 7 years performing live music on guitar and cajon, both ongoing.';

export const photoAlt = "Adriel Tang in glasses and a black shirt, looking down at an acoustic guitar as he plays.";
