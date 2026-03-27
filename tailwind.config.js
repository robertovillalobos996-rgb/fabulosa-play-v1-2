/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        tv: {
          bg: '#18192c',
          card: '#222338',
          active: '#2d2e46',
          accent: '#ff6600',
          text: '#ffffff',
          muted: '#838499',
        }
      },
      backgroundImage: {
        'main-gradient': 'linear-gradient(135deg, #242545 0%, #18192c 100%)',
      }
    },
  },
  plugins: [],
}