// components/ContactForm.tsx - FROSTED GLASS SUBMIT BUTTON

"use client";
import React, { useState } from 'react';

// NOTE: This is a placeholder form component. Replace it with your actual form logic
// (e.g., state, error handling, API submission logic).

export default function ContactForm() {
    const [status, setStatus] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        
        // --- Replace this with your actual form submission logic (e.g., fetch, API call) ---
        setTimeout(() => {
            // Simulate success
            setStatus('success');
        }, 2000);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                    type="text"
                    id="name"
                    required
                    className="w-full p-3 rounded-md bg-zinc-800/70 border border-zinc-700 focus:ring-sky-500 focus:border-sky-500 text-gray-100"
                    placeholder="Your Name"
                />
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                    type="email"
                    id="email"
                    required
                    className="w-full p-3 rounded-md bg-zinc-800/70 border border-zinc-700 focus:ring-sky-500 focus:border-sky-500 text-gray-100"
                    placeholder="you@example.com"
                />
            </div>

            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                <textarea
                    id="message"
                    rows={4}
                    required
                    className="w-full p-3 rounded-md bg-zinc-800/70 border border-zinc-700 focus:ring-sky-500 focus:border-sky-500 text-gray-100 resize-none"
                    placeholder="How can I help you?"
                />
            </div>

            {/* 🎯 SUBMIT BUTTON - SYNCHRONIZED FROSTED GLASS STYLE */}
            <button
                type="submit"
                disabled={status === 'submitting'}
                className="
                    w-full inline-block px-8 py-3 text-lg font-semibold rounded-full shadow-xl relative
                    
                    // FROSTED GLASS BASE
                    bg-sky-600/40 backdrop-blur-md 
                    
                    // COLOR, BORDER, RING (Matches About Page Button)
                    text-white
                    border border-sky-500/50 ring-1 ring-sky-500/50 
                    
                    // HOVER EFFECT
                    hover:bg-sky-500/60 active:bg-sky-700/80 
                    transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed
                "
            >
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
            </button>

            {status === 'success' && (
                <p className="text-center text-green-400 mt-4">Message sent successfully!</p>
            )}
        </form>
    );
}