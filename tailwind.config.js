/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        steam: {
          blue: '#1b2838',
          darkblue: '#171a21',
          lightblue: '#2a475e',
          green: '#90ba3c',
          orange: '#cd5c28',
        },
        tier: {
          S: '#ff7f80',
          A: '#ffbf7f',
          B: '#ffdf80',
          C: '#ffff7f',
          D: '#bfff7f',
          F: '#7fff7f'
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-ridicc': 'linear-gradient(45deg, #8b5cf6, #f97316, #8b5cf6)',
      },
    },
  },
  plugins: [],
}