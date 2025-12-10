// components/Navbar.tsx - SYNCHRONIZED FROSTED GLASS DESIGN (Buttons Refined)

"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation'; 

const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Experience', href: '/experience'},
    { label: 'Projects', href: '/projects' },
    { label: 'Contact', 'href': '/contact' },
];

export default function Navbar() {
    const pathname = usePathname(); 

    return (
        // We use a fixed wrapper to position the navbar centrally and slightly lifted
        <nav className="fixed w-[calc(100%-48px)] max-w-7xl top-5 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300">
            
            {/* Container for the Glass Effect - SYNCHRONIZED STYLES */}
            <div 
                className="
                    // Use darker, zinc-based translucent background
                    bg-zinc-900/40 backdrop-blur-lg shadow-2xl rounded-full p-2
                    
                    // Add the consistent glass highlight border/ring
                    ring-1 ring-inset ring-white/10 border border-white/5
                "
            >
                <div className="flex justify-between items-center px-4">
                    
                    {/* Logo/Name */}
                    <Link 
                        href="/" 
                        className="text-gray-100 text-2xl font-black hover:text-sky-400 transition-colors duration-200"
                    >
                        ADRIEL TANG
                    </Link>
                    
                    {/* Navigation Links */}
                    <div className="flex space-x-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;

                            return (
                                <Link 
                                    key={item.label}
                                    href={item.href}
                                    scroll={true} 
                                    className={`
                                        // Base button style
                                        px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 
                                        
                                        ${isActive 
                                            // Active: Sky background, strong shadow (KEPT)
                                            ? 'bg-sky-600 text-white shadow-lg' 
                                            // INACTIVE: Synchronized to use dark zinc hover/active state
                                            // This makes the hover effect appear more grounded in the dark aesthetic.
                                            : 'text-gray-100 hover:text-sky-400 hover:bg-zinc-800/50 active:bg-zinc-700/70' 
                                        }
                                    `}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
}