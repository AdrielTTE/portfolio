// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Ensure your content paths are correct
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Define the 'blink' keyframes
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      // Apply the keyframes to the 'animate-blink' utility
      animation: {
        blink: 'blink 1s step-end infinite', 
      },
    },
  },
  plugins: [],
};