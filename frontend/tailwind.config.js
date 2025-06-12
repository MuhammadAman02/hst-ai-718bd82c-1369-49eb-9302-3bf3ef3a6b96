/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nike: {
          black: '#000000',
          white: '#FFFFFF',
          red: '#FF0000',
          orange: '#FF6B35',
          gray: {
            100: '#F7F7F7',
            200: '#E5E5E5',
            300: '#CCCCCC',
            400: '#999999',
            500: '#666666',
            600: '#4A4A4A',
            700: '#2D2D2D',
            800: '#1A1A1A',
            900: '#111111'
          }
        }
      },
      fontFamily: {
        'nike': ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-in': 'slideIn 0.5s ease-out',
        'bounce-subtle': 'bounceSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    },
  },
  plugins: [],
}