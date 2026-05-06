/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0e27',
        'background-secondary': '#0f1729',
        foreground: '#f1f5f9',
        'foreground-secondary': '#cbd5e1',
        primary: '#0ea5e9',
        'primary-dark': '#0284c7',
        'primary-light': '#06b6d4',
        secondary: '#8b5cf6',
        'secondary-light': '#a78bfa',
        accent: '#10b981',
        'accent-light': '#34d399',
        muted: '#cbd5e1',
        border: '#1e293b',
        'border-light': '#334155',
        card: '#0f1729',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(14, 165, 233, 0.3)',
        'glow-lg': '0 0 30px rgba(14, 165, 233, 0.4)',
      },
    },
  },
  plugins: [],
}
