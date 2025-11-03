/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Fredoka One', 'cursive'],
        'body': ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: '#FF6B6B',
        secondary: '#4ECDC4',
        accent: '#FFD93D',
        success: '#6BCF7F',
        warning: '#FFA94D',
        error: '#FF6B6B',
        info: '#74B9FF',
        surface: '#FFFFFF',
        background: '#F7F9FC',
      },
      animation: {
        'bounce-in': 'bounceIn 0.6s ease-out',
        'scale-bounce': 'scaleBounce 0.4s ease-out',
        'star-earn': 'starEarn 0.8s ease-out',
        'confetti': 'confetti 1s ease-out',
      },
      keyframes: {
        bounceIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '60%': { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleBounce: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        starEarn: {
          '0%': { transform: 'rotate(0deg) scale(0)', opacity: '0' },
          '50%': { transform: 'rotate(180deg) scale(1.2)', opacity: '1' },
          '100%': { transform: 'rotate(360deg) scale(1)', opacity: '1' },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(-200px) rotate(720deg)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}