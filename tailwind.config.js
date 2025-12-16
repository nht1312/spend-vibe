/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        safe: '#0FA9A7',
        warn: '#F4B400',
        alert: '#EF4444',
        ink: '#0F172A',
        sand: '#F8FAFC',
      },
    },
  },
  plugins: [],
}

