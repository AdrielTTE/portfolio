// app/contact/page.tsx - FINAL PRESENTABLE VERSION

"use client"; // Required for using Framer Motion
import ContactForm from '@/components/ContactForm'; 
import { motion } from 'framer-motion'; 
import { FaWhatsapp } from 'react-icons/fa';

const WHATSAPP_NUMBER = '60163231053'; 
const WHATSAPP_MESSAGE = "Hello there, I am interested in your services";

const getWhatsAppUrl = () => {
    const encodedMessage = encodeURIComponent(WHATSAPP_MESSAGE);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
};

export default function ContactPage() {
    return (
        // Outer container with padding to clear the floating Navbar
        <div className="container mx-auto p-8 pt-32 text-gray-100">
            
            {/* 🚀 MAIN CONTENT WRAPPER: Framer Motion Animation */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-xl mx-auto bg-zinc-800/80 p-10 rounded-xl shadow-2xl border border-zinc-700/50"
            >
                
                {/* Header and Subtitle - Centered within the box */}
                <h1 className="text-5xl font-extrabold text-center text-white mb-4">
                    Get In Touch
                </h1>
                <p className="text-xl text-center text-sky-400 max-w-2xl mx-auto mb-16">
                    Let's build something great together.
                </p>

                {/* 1. CONSOLIDATED CONTACT LINKS BLOCK */}
                <div className="text-center mb-16">
                    <h2 className="text-2xl font-bold mb-6 text-gray-300">
                        Reach Me Directly
                    </h2>
                    
                    {/* Grid for side-by-side Email and WhatsApp */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                        
                        {/* Email Link Block */}
                        <div className="flex flex-col items-center p-4 border border-zinc-700/50 rounded-lg">
                            <h3 className="text-md font-medium text-gray-400 mb-2">Send an Email</h3>
                            <a 
                                href="mailto:adrieltangte@gmail.com" 
                                className="text-sky-500 hover:text-sky-400 text-lg font-semibold transition-colors duration-200"
                                aria-label="Email Me Directly"
                            >
                                adrieltangte@gmail.com
                            </a>
                        </div>
                        
                        {/* WhatsApp Link Block */} 
                        <div className="flex flex-col items-center p-4 border border-zinc-700/50 rounded-lg">
                            <h3 className="text-md font-medium text-gray-400 mb-2">Quick Chat</h3>
                            <a 
                                href={getWhatsAppUrl()} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-500 hover:text-green-400 text-lg font-semibold transition-colors duration-200 flex items-center"
                                aria-label="Start WhatsApp Chat"
                            >
                                <FaWhatsapp className="mr-2" size={20} />
                                WhatsApp Me
                            </a>
                        </div>
                    </div>
                </div>
                {/* END CONSOLIDATED CONTACT LINKS BLOCK */}


                {/* Contact Form Section */}
                <h2 className="text-3xl font-bold mb-8 text-center text-white border-t border-zinc-700 pt-10">
                    Or Send a Message Securely
                </h2>
                
                {/* Form is contained in a minimal border */}
                <div className="p-6 border border-zinc-700/80 rounded-lg">
                    <ContactForm />
                </div>
            </motion.div>
            
            {/* Bottom padding for clearance */}
            <div className="pb-24"></div> 
        </div>
    );
}