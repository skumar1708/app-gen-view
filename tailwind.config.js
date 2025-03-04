/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [
    function ({ addComponents, theme }) {
      addComponents({
        '.scrollbar-w-2::-webkit-scrollbar': {
          width: '0.5rem',
        },
        '.scrollbar-w-2::-webkit-scrollbar-track': {
          backgroundColor: '#edf2f7', // Light gray background
        },
        '.scrollbar-w-2::-webkit-scrollbar-thumb': {
          backgroundColor: '#a0aec0', // Gray thumb color
          borderRadius: '0.5rem',
        },
        '.scrollbar-thin::-webkit-scrollbar': {
          width: '0.25rem',
        },
        '.scrollbar-thin::-webkit-scrollbar-track': {
          backgroundColor: '#e2e8f0',
        },
        '.scrollbar-thin::-webkit-scrollbar-thumb': {
          backgroundColor: '#718096',
          borderRadius: '0.125rem',
        },
        '.scrollbar-hide::-webkit-scrollbar':{
          display:'none',
        },
        '.scrollbar-hide':{
          '-ms-overflow-style':'none',
          'scrollbar-width':'none',
        },
        '.scrollbar-rounded::-webkit-scrollbar-thumb':{
          borderRadius: '1rem',
        },
        '.scrollbar-track-blue-lighter::-webkit-scrollbar-track':{
          backgroundColor:'#dbeafe',
        },
        '.scrollbar-thumb-blue::-webkit-scrollbar-thumb':{
          backgroundColor:'#60a5fa',
        },
        '.scrollbar-track-gray-lighter::-webkit-scrollbar-track':{
          backgroundColor:'#f3f4f6',
        },
        '.scrollbar-thumb-gray::-webkit-scrollbar-thumb':{
          backgroundColor:'#9ca3af',
        },
        '.scrollbar-thin-track-gray-lighter::-webkit-scrollbar-track':{
          backgroundColor:'#f3f4f6',
        },
        '.scrollbar-thin-thumb-gray::-webkit-scrollbar-thumb':{
          backgroundColor:'#9ca3af',
          borderRadius: '0.125rem',
        },
        '.scrollbar-firefox':{
          scrollbarWidth: 'thin',
          scrollbarColor: '#9ca3af #f3f4f6',
        }
      });
    },
  ]
};

