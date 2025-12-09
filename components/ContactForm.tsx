// components/ContactForm.tsx - FINAL THEME VERSION

"use client"; // Retain the client directive for best practice with interactive forms

import React from 'react';

export default function ContactForm() {
  // Replace the placeholder below with the actual URL you copied from Formspree!
  const FORM_ACTION_URL = 'https://formspree.io/f/mwpgnwzl';

  return (
    <form action={FORM_ACTION_URL} method="POST" className="space-y-6">
      
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
          Your Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          placeholder="e.g., Jane Doe"
          // Minimalist Dark Input Styling (Dark background, light text, Sky Blue focus)
          className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-gray-100 placeholder-gray-500 
                     focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors duration-200"
        />
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          Your Email
        </label>
        <input
          type="email"
          name="_replyto" 
          id="email"
          required
          placeholder="you@example.com"
          // Minimalist Dark Input Styling
          className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-gray-100 placeholder-gray-500 
                     focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors duration-200"
        />
      </div>

      {/* Message Field */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
          Message
        </label>
        <textarea
          name="message"
          id="message"
          rows={5} // Increased rows for better visual balance
          required
          placeholder="Tell me about your project or opportunity!"
          // Minimalist Dark Input Styling
          className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-gray-100 placeholder-gray-500 
                     focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors duration-200"
        />
      </div>
      
      {/* Submit Button - Sky Blue Primary Color and Material Geometry (Pill shape) */}
      <button
        type="submit"
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-lg text-lg font-semibold 
                   bg-sky-600 text-white hover:bg-sky-500 active:bg-sky-700 focus:ring-4 focus:ring-sky-500 focus:ring-opacity-50
                   transition-all duration-200"
      >
        Send Message
      </button>
    </form>
  );
}   