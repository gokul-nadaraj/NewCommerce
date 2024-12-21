/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: 
      {
        animation: {
          bounce: "bounce 1s infinite",
          fade: "fade-in 1.5s ease-out",
        },
        
        keyframes: {
          bounce: {
            "0%, 100%": { transform: "translateY(0)" },
            "50%": { transform: "translateY(-10px)" },
          },
          "fade-in": {
            from: { opacity: 0 },
            to: { opacity: 1 },
          },
          keyframes: {
            "fade-right": {
              "0%": { opacity: 0, transform: "translateX(-20px)" },
              "100%": { opacity: 1, transform: "translateX(0)" },
            },
            
        },
    },
  },
  plugins: [],
}}
