/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif']
      },
      colors: {
        ink: {
          50:  '#f5f7fa',
          100: '#e7ecf2',
          200: '#cbd5e1',
          400: '#64748b',
          700: '#334155',
          900: '#0b1220',
          950: '#070b15'
        },
        accent: {
          DEFAULT: '#facc15',  // yellow
          600: '#eab308',
          700: '#a16207'
        },
        ocean: {
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7'
        }
      }
    }
  },
  plugins: []
};
