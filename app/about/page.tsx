// app/about/page.tsx - FINAL DIAMOND ALIGNMENT FIX

"use client";
import Image from 'next/image';
import { motion, Variants } from 'framer-motion'; // 💡 FIX: Import Variants type

// 1. Define the Scroll Animation Variant
// 💡 FIX: Explicitly define the type as Variants
const scrollReveal: Variants = { 
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: "easeOut",
        },
    },
};

const timelineData = [
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

// This variant is for the initial large container entrance (already applied)
// 💡 FIX: Explicitly define the type as Variants (Good practice, though not strictly required here)
const contentEntrance: Variants = { 
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.1 } },
};

export default function AboutPage() {
    return (
        <div className="container mx-auto p-8 pt-32 text-gray-100">

            {/* SECTION 1: PROFILE CARD - Keeps initial animation */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-zinc-800/80 rounded-xl p-12 shadow-2xl mb-24"
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

                    <div className="relative w-full h-72 rounded-lg shadow-xl border-2 border-sky-600 overflow-hidden lg:h-96">
                        <Image
                            src="/images/tempProfile.jpg"
                            alt="Adriel Tang Thien Ern Professional Profile"
                            fill
                            style={{ objectFit: 'cover' }}
                            priority
                        />
                    </div>

                    <div className="lg:col-span-2">
                        <h1 className="text-5xl font-extrabold mb-5 text-white">
                            ADRIEL TANG THIEN ERN
                        </h1>
                        <h2 className="text-3xl font-light mb-10 text-sky-400">
                            Full Stack Developer | Architecting Modern Solutions
                        </h2>

                        <p className="text-xl text-gray-300 mb-6 font-semibold border-l-4 border-sky-500 pl-4 italic leading-relaxed">
                            "I am a results-focused Full Stack Developer specializing in **delivering high-performance** web and cross-platform mobile applications. My passion lies in **architecting robust solutions** that prioritize optimal user experience and scalable efficiency."
                        </p>

                        <p className="text-lg text-gray-400">
                            With proven experience in both **front-end mastery (React/Next.js)** and **back-end resilience (Node.js, ASP.NET Core)**, I thrive on translating complex requirements into elegant, user-friendly interfaces. I constantly **seek opportunities to innovate**, ensuring every project provides measurable value to clients and stakeholders.
                        </p>
                    </div>
                </div>
            </motion.div>


            {/* SECTION 2: DEVELOPMENT PHILOSOPHY (Scroll Reveal Applied) */}
            <motion.div
                variants={scrollReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }} // Animation triggers once when 20% of section is visible
            >
                <h2 className="text-3xl font-bold mt-4 mb-8 border-b border-zinc-700 pb-3 text-sky-500">
                    Development Philosophy
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16 text-center">

                    <div className="p-4">
                        <h3 className="text-xl font-bold text-sky-500 mb-1">Scalability</h3>
                        <p className="text-sm text-gray-400">Building code structures that anticipate future growth and handle high traffic seamlessly.</p>
                    </div>
                    <div className="p-4">
                        <h3 className="text-xl font-bold text-sky-500 mb-1">User-Centricity</h3>
                        <p className="text-sm text-gray-400">Prioritizing accessibility and intuitive design for exceptional, inclusive user experiences.</p>
                    </div>
                    <div className="p-4">
                        <h3 className="text-xl font-bold text-sky-500 mb-1">Code Quality</h3>
                        <p className="text-sm text-gray-400">Focusing on clean, documented, and maintainable C#/TypeScript code through rigorous standards.</p>
                    </div>
                </div>
            </motion.div>


            {/* SECTION 3: EDUCATION & CAREER PATH (Scroll Reveal Applied) */}
            <motion.div
                variants={scrollReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <h2 className="text-3xl font-bold mt-16 mb-8 border-b border-zinc-700 pb-3 text-white">
                    Education & Career Path
                </h2>
                <div className="relative pl-6 sm:pl-10 pb-4">
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-zinc-700 sm:left-6"></div>

                    {timelineData.map((item, index) => (
                        // Apply animation to each timeline item for a staggered effect
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true, amount: 0.5 }}
                            className="mb-8 relative"
                        >
                            <div className={`absolute -left-1.5 sm:left-4 -translate-x-1/2 mt-2 w-4 h-4 rounded-full border-2 border-sky-600 ${item.iconColor} bg-zinc-800`}></div>

                            <div className="ml-0 sm:ml-8">
                                <p className="text-sm font-light text-gray-400 mb-1">{item.date}</p>
                                <h3 className="text-xl font-extrabold text-white mb-1">{item.title}</h3>
                                <p className="text-md font-medium text-sky-400 mb-2">{item.institution}</p>
                                <p className="text-gray-300">{item.details}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* SECTION 4: TECHNICAL EXPERTISE (Scroll Reveal Applied) */}
            <motion.div
                variants={scrollReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <h2 className="text-3xl font-bold mt-16 mb-8 border-b border-zinc-700 pb-3 text-white">
                    Technical Expertise
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-12 mb-24">

                    {/* Grouping the three columns for a single reveal effect */}
                    <div className="border-l-4 border-sky-600 pl-4">
                        <h3 className="text-2xl font-bold text-sky-400 mb-3">Frameworks & Libraries</h3>
                        <ul className="space-y-3 text-gray-300">
                            <li className="flex items-start">
                                <span className="text-sky-500 mr-2 text-xl flex-shrink-0 w-5">→</span>
                                <span className="leading-snug"><strong>Front-End:</strong> React, Next.js, Redux</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-sky-500 mr-2 text-xl flex-shrink-0 w-5">→</span>
                                <span className="leading-snug"><strong>Mobile:</strong> Flutter (Cross-Platform)</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-sky-500 mr-2 text-xl flex-shrink-0 w-5">→</span>
                                <span className="leading-snug"><strong>Styling:</strong> Tailwind CSS, Bootstrap CSS</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-sky-500 mr-2 text-xl flex-shrink-0 w-5">→</span>
                                <span className="leading-snug"><strong>Full Stack:</strong> ASP.NET MVC Core, Node.js, Laravel MVC</span>
                            </li>
                        </ul>
                    </div>

                    <div className="border-l-4 border-sky-600 pl-4">
                        <h3 className="text-2xl font-bold text-sky-400 mb-3">Languages & Tools</h3>
                        <ul className="space-y-3 text-gray-300">
                            <li className="flex items-start">
                                <span className="text-sky-500 mr-2 text-xl flex-shrink-0 w-5">→</span>
                                <span className="leading-snug"><strong>Primary:</strong> TypeScript, JavaScript, Dart, C#</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-sky-500 mr-2 text-xl flex-shrink-0 w-5">→</span>
                                <span className="leading-snug"><strong>Proficient:</strong> Java, Python, C++</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-sky-500 mr-2 text-xl flex-shrink-0 w-5">→</span>
                                <span className="leading-snug"><strong>Versioning:</strong> Git, GitHub</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-sky-500 mr-2 text-xl flex-shrink-0 w-5">→</span>
                                <span className="leading-snug"><strong>APIs:</strong> RESTful Design</span>
                            </li>
                        </ul>
                    </div>

                    <div className="border-l-4 border-sky-600 pl-4">
                        <h3 className="text-2xl font-bold text-sky-400 mb-3">Data & Fundamentals</h3>
                        <ul className="space-y-3 text-gray-300">
                            <li className="flex items-start">
                                <span className="text-sky-500 mr-2 text-xl flex-shrink-0 w-5">→</span>
                                <span className="leading-snug"><strong>Database:</strong> MySQL, SQL Server</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-sky-500 mr-2 text-xl flex-shrink-0 w-5">→</span>
                                <span className="leading-snug"><strong>Web:</strong> HTML, CSS3, NPM</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-sky-500 mr-2 text-xl flex-shrink-0 w-5">→</span>
                                <span className="leading-snug"><strong>Concepts:</strong> OOP, Data Structures</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-sky-500 mr-2 text-xl flex-shrink-0 w-5">→</span>
                                <span className="leading-snug"><strong>Architecture:</strong> MVC, Component-Based Design</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </motion.div>

            <div className="text-center pb-24">
                <a
                    href="/contact"
                    className="inline-block px-8 py-3 bg-sky-600 text-white text-lg font-semibold rounded-full shadow-xl
                         hover:bg-sky-500 active:bg-sky-700 transition-colors duration-200 focus:ring-4 focus:ring-sky-500 focus:ring-opacity-50"
                >
                    Let's Build Something Great Together
                </a>
            </div>
        </div>
    );
}