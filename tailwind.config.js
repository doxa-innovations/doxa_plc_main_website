/** @type {import('tailwindcss').Config} */
import fluid, { extract, screens, fontSize } from 'fluid-tailwind'



export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens, // Tailwind's default screens, in `rem`
    fontSize, // Tailwind's default font sizes, in `rem` (including line heights)
    fontFamily: {
      'pj-font': 'Poppins'
    },
    extend: {
      backgroundSize: {
        'fill': '100%'
      },
      backgroundImage: {
        // 'honeycone': "url('/src/images/SVGs/hexagon.svg')",
        // 'honeycone-fill': "url('/src/images/SVGs/hexagon2.svg')",
      },
      colors: {
        'pj-light-Dark': '#2F2F2F',
        'pj-black': '#000000',
        'pj-white': '#ECECEC',
        'pj-dark': '#1E1E1E',
        'pj-primary': '#E37E03',
        'pj-secondary': '#F4BC33',
        'pj-accent': '#5F3A0D'
      }
    },
    extract
  },
  plugins: [
    fluid
  ],
}