"use client";
import { motion } from 'framer-motion'; 
import { FaWhatsapp } from 'react-icons/fa';
// Import useState for form state management
import React, { useState } from 'react';

const WHATSAPP_NUMBER = '60163231053'; 
const WHATSAPP_MESSAGE = "Hello there, I am interested in your services";

const getWhatsAppUrl = () => {
    const encodedMessage = encodeURIComponent(WHATSAPP_MESSAGE);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
};

export default function ContactPage() {
    // 1. STATE FOR FORM INPUTS AND SUBMISSION STATUS
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState(''); // 'loading', 'success', 'error'
    
    // Formspree endpoint (keep this constant)
    const FORM_URL = 'https://formspree.io/f/mwpgnwzl'; 

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 2. THE NEW ASYNCHRONOUS SUBMISSION HANDLER
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Stop the default form submission
        setStatus('loading');

        try {
            const response = await fetch(FORM_URL, {
                method: 'POST',
                // Crucial change: Send data as JSON in the body
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData), // Convert state to JSON string
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' }); // Clear form
            } else {
                // Handle Formspree specific errors
                const data = await response.json();
                console.error("Formspree Error:", data);
                setStatus('error');
            }
        } catch (error) {
            console.error("Submission failed:", error);
            setStatus('error');
        }
    };

    return (
        <div className="container mx-auto p-8 pt-32 text-gray-100">
            {/* 🚀 MAIN CONTENT WRAPPER: SYNCHRONIZED FROSTED GLASS STYLE */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-xl mx-auto p-10 rounded-xl shadow-2xl 
                           bg-zinc-900/40 backdrop-blur-lg 
                           ring-1 ring-inset ring-white/10 border border-white/5"
            >
                
                <h1 className="text-5xl font-extrabold text-center text-white mb-4">
                    Get In Touch
                </h1>
                <p className="text-xl text-center text-sky-400 max-w-2xl mx-auto mb-16">
                    Let's build something great together.
                </p>

                {/* (Contact Links Block remains unchanged) */}
                <div className="text-center mb-16">
                    <h2 className="text-2xl font-bold mb-6 text-gray-300">
                        Reach Me Directly
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                        {/* Email Link Block - FROSTED GLASS CARD */}
                        <div className="flex flex-col items-center p-4 rounded-xl 
                                     bg-white/5 backdrop-blur-sm border border-white/10 
                                     transition-transform duration-300 hover:bg-white/10">
                            <h3 className="text-md font-medium text-gray-400 mb-2">Send an Email</h3>
                            <a 
                                href="mailto:adrieltangte@gmail.com" 
                                className="text-sky-400 hover:text-sky-300 text-lg font-semibold transition-colors duration-200"
                                aria-label="Email Me Directly"
                            >
                                adrieltangte@gmail.com
                            </a>
                        </div>
                        
                        {/* WhatsApp Link Block - FROSTED GLASS CARD */} 
                        <div className="flex flex-col items-center p-4 rounded-xl 
                                     bg-white/5 backdrop-blur-sm border border-white/10 
                                     transition-transform duration-300 hover:bg-white/10">
                            <h3 className="text-md font-medium text-gray-400 mb-2">Quick Chat</h3>
                            <a 
                                href={getWhatsAppUrl()} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-400 hover:text-green-300 text-lg font-semibold transition-colors duration-200 flex items-center"
                                aria-label="Start WhatsApp Chat"
                            >
                                <FaWhatsapp className="mr-2" size={20} />
                                WhatsApp Me
                            </a>
                        </div>
                    </div>
                </div>

                <h2 className="text-3xl font-bold mb-8 text-center text-white border-t border-zinc-700 pt-10">
                    Or Send a Message Securely
                </h2>
                
                {/* Inner Form Well (SUBMIT HANDLER APPLIED HERE) */}
                <div className="p-6 bg-zinc-900/50 rounded-lg">
                    <form 
                        // REMOVED action="https://formspree.io/f/mwpgnwzl" 
                        // REMOVED method="POST"
                        onSubmit={handleSubmit} // 👈 Added the new handler
                        className="space-y-4" 
                    >
                        <input 
                            type="text" 
                            name="name" 
                            placeholder="Your Name" 
                            value={formData.name} // 👈 Added value/onChange
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 focus:ring-sky-500 focus:border-sky-500"
                            required
                        />
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Your Email" 
                            value={formData.email} // 👈 Added value/onChange
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 focus:ring-sky-500 focus:border-sky-500"
                            required
                        />
                        <textarea 
                            name="message" 
                            placeholder="Your Message" 
                            rows={5}
                            value={formData.message} // 👈 Added value/onChange
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 focus:ring-sky-500 focus:border-sky-500"
                            required
                        ></textarea>
                        
                        {/* Status/Loading Indicator */}
                        {status === 'success' && (
                            <p className="text-center text-green-400 font-bold">Message sent successfully!</p>
                        )}
                        {status === 'error' && (
                            <p className="text-center text-red-400 font-bold">Failed to send message. Please try WhatsApp or email.</p>
                        )}
                        
                        {/* 🌟 SYNCHRONIZED SUBMIT BUTTON 🌟 */}
                        <button 
                            type="submit" 
                            disabled={status === 'loading'} // Disable while loading
                            className={`
                                w-full mt-4 px-6 py-3 text-lg font-semibold rounded-full transition-all duration-300 ease-in-out 
                                shadow-lg shadow-sky-900/50 
                                ${status === 'loading' 
                                    ? 'bg-sky-700 cursor-not-allowed opacity-70' 
                                    : 'bg-sky-600 hover:bg-sky-500 active:bg-sky-700'}
                                text-white
                            `}
                        >
                            {status === 'loading' ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </motion.div>
            
            <div className="pb-24"></div> 
        </div>
    );
}