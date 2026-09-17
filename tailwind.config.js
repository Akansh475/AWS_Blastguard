/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        blast: {
          950: '#07090e',
          900: '#0c1017',
          850: '#111722',
          800: '#17202f',
          700: '#233044',
          600: '#34455d',
          accent: '#ff5c28',
          amber: '#f59e0b',
          cyan: '#06b6d4',
          emerald: '#10b981',
          danger: '#ef4444',
          purple: '#8b5cf6',
          blue: '#3b82f6'
        }
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
      }
    },
  },
  plugins: [],
}
