// app/about/page.tsx - ENHANCED VERSION (Identity, Philosophy & Interdisciplinary Skills)

"use client";
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { FaMicrophoneAlt, FaHandsHelping, FaHeadphones } from 'react-icons/fa'; // Import icons for new section

// ====================================================================
// 1. ANIMATION VARIANTS
// ====================================================================

// Standard scroll-reveal for large sections
const scrollReveal: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" },
    },
};

// ====================================================================
// 2. MAIN PAGE COMPONENT
// ====================================================================

export default function AboutPage() {
    return (
        <div className="container mx-auto p-8 pt-32 text-gray-100">

            {/* SECTION 1: PROFILE CARD - Glassmorphism (KEPT) */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-zinc-900/40 backdrop-blur-lg rounded-xl p-12 shadow-2xl mb-24 ring-1 ring-inset ring-white/10 border border-white/5"
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
                            Adriel Tang Thien Ern
                        </h1>
                        <h2 className="text-3xl font-light mb-10 text-sky-400">
                            Full Stack Development | Application Deployment
                        </h2>
                        <p className="text-xl text-gray-300 mb-6 font-semibold border-l-4 border-sky-500 pl-4 italic leading-relaxed">
                            "I am a results-focused Full Stack Developer specializing in delivering high-performance and structured web and cross-platform mobile applications. My passion lies in learning new methods and streamlining processes that prioritize optimal user experience and scalable efficiency."
                        </p>
                        <p className="text-lg text-gray-400">
                            With proven experience in both front-end mastery (React/Next.js) and back-end resilience (Node.js, ASP.NET MVC Core), I thrive on translating complex requirements into elegant, user-friendly interfaces. I constantly seek opportunities to learn and innovate, ensuring every project provides measurable value to clients and stakeholders.
                        </p>
                    </div>
                </div>
            </motion.div>


            <div className="space-y-24">
                {/* SECTION 2: DEVELOPMENT PHILOSOPHY - Glassmorphism Container (KEPT) */}
                <motion.div
                    variants={scrollReveal}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="p-10 rounded-xl bg-zinc-900/30 backdrop-blur-md shadow-xl ring-1 ring-inset ring-white/10"
                >
                    <h2 className="text-3xl font-bold mt-4 mb-8 border-b border-zinc-700 pb-3 text-sky-500">
                        Development Philosophy 💡
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6 text-center">

                        {/* FROSTED GLASS CARDS for Philosophy items (KEPT) */}
                        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 transition-transform duration-300 hover:scale-[1.03] hover:shadow-sky-500/30 shadow-lg">
                            <h3 className="text-xl font-bold text-sky-400 mb-1">Scalability</h3>
                            <p className="text-sm text-gray-300">Building code structures that anticipate future growth and handle high traffic seamlessly.</p>
                        </div>
                        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 transition-transform duration-300 hover:scale-[1.03] hover:shadow-sky-500/30 shadow-lg">
                            <h3 className="text-xl font-bold text-sky-400 mb-1">User-Centricity</h3>
                            <p className="text-sm text-gray-300">Prioritizing accessibility and intuitive design for exceptional, inclusive user experiences.</p>
                        </div>
                        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 transition-transform duration-300 hover:scale-[1.03] hover:shadow-sky-500/30 shadow-lg">
                            <h3 className="text-xl font-bold text-sky-400 mb-1">Code Quality</h3>
                            <p className="text-sm text-gray-300">Focusing on clean, documented, and maintainable C#/TypeScript code through rigorous standards.</p>
                        </div>
                    </div>
                </motion.div>
                
                {/* 🚨 ENHANCED SECTION 3: INTERDISCIPLINARY SKILLS */}
                <motion.div
                    variants={scrollReveal}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="p-10 rounded-xl bg-zinc-900/30 backdrop-blur-md shadow-xl ring-1 ring-inset ring-white/10"
                >
                    <h2 className="text-3xl font-bold mt-4 mb-8 border-b border-zinc-700 pb-3 text-sky-500">
                        Interdisciplinary Skills & Reliability 🤝
                    </h2>
                    <p className="text-lg text-gray-400 mb-8">
                        My commitments outside of software development—including 8 years in the audio & visual (AV) field, 2 years as an audio & visual (AV) Coordinator, and 7 years of live musical performance—provide a foundation of long-term dedication to systems management, reliability, and precision.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        
                        {/* 3.1 AV Coordinator - Systems Thinking (Focus on 8 years) */}
                        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 transition-transform duration-300 hover:scale-[1.03] hover:shadow-sky-500/30 shadow-lg">
                            <FaHeadphones size={32} className="mx-auto mb-3 text-sky-400" />
                            <h3 className="text-xl font-bold text-white mb-1">Enduring System Reliability</h3>
                            <p className="text-sm font-semibold text-sky-400/80 mb-2">8 Years</p>
                            <p className="text-sm text-gray-300">Managing complex audio & visual (AV) setups for nearly a decade translates into an inherent ability to setup, operate, and troubleshoot complex issues under high-stakes conditions.</p>
                        </div>
                        
                        {/* 3.2 Church Member - Service & Coordination (Refined) */}
                        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 transition-transform duration-300 hover:scale-[1.03] hover:shadow-sky-500/30 shadow-lg">
                            <FaHandsHelping size={32} className="mx-auto mb-3 text-sky-400" />
                            <h3 className="text-xl font-bold text-white mb-1">Coordination & Service Mindset</h3>
                            <p className="text-sm font-semibold text-sky-400/80 mb-2">2 Years</p>
                            <p className="text-sm text-gray-300">Serving as a coordinator requires precise communication, scheduling, and technical training, essential for coordinating complex features across an agile development team.</p>
                        </div>

                        {/* 3.3 Music Gigs - Performance Under Pressure (Focus on 7 years) */}
                        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 transition-transform duration-300 hover:scale-[1.03] hover:hover:shadow-sky-500/30 shadow-lg">
                            <FaMicrophoneAlt size={32} className="mx-auto mb-3 text-sky-400" />
                            <h3 className="text-xl font-bold text-white mb-1">Flawless Live Delivery</h3>
                            <p className="text-sm font-semibold text-sky-400/80 mb-2">7 Years</p>
                            <p className="text-sm text-gray-300">Seven years of live performance instills the discipline to deliver complex projects flawlessly under strict deadlines and high-visibility scenarios, focusing on immediate problem-solving and quality control.</p>
                        </div>
                    </div>
                </motion.div>
                
            </div>


            {/* CTA: Directs to the Denser Experience Page (KEPT) */}
            <div className="text-center pt-24 pb-24">
                <a
                    href="/experience" 
                    className="
                        inline-block px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 ease-in-out
                        bg-sky-600 text-white shadow-xl shadow-sky-900/50 hover:bg-sky-500 active:bg-sky-700
                    "
                >
                    View Full Experience & Technical Stack
                </a>
            </div>
        </div>
    );
}