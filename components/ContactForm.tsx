// components/ContactForm.tsx
import React from 'react';

export default function ContactForm() {
  // Replace the placeholder below with the actual URL you copied from Formspree!
  const FORM_ACTION_URL = 'https://formspree.io/f/mwpgnwzl';

  return (
    <form action={FORM_ACTION_URL} method="POST" className="space-y-6">
      
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Your Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          placeholder="e.g., Jane Doe"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Your Email
        </label>
        <input
          type="email"
          name="_replyto" // Formspree uses this name for the reply-to header
          id="email"
          required
          placeholder="you@example.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Message Field */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message
        </label>
        <textarea
          name="message"
          id="message"
          rows={4}
          required
          placeholder="Tell me about your project or opportunity!"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      
      {/* Submit Button */}
      <button
        type="submit"
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
      >
        Send Message
      </button>
    </form>
  );
}