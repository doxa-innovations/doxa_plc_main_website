import type {Config} from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      'pj-font': ['Georama', 'sans-serif'],
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
        'pj-primary': '#7851A9',
        'pj-secondary': '#b277d3',
        'pj-accent': '#19003a'
      },
      animation: {
        "blob": "blob 10s infinite ease-in-out",
      },
      keyframes: {
        "blob": {
          "0%": {
            transform: "translate(0, 0) scale(1)",
          },
          "25%": {
            transform: "translate(10px, 10px) scale(1.05)",
          },
          "50%": {
            transform: "translate(-20px, -20px) scale(1.1)",
          },
          "75%": {
            transform: "translate(-10px, 10px) scale(1.05)",
          },
          "100%": {
            transform: "translate(0, 0) scale(1)",
          }
        }
      }
    },
  },
  plugins: [],
} satisfies Config;
