/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F2FBF7',
          100: '#E1F5EE',
          200: '#C3EBDC',
          300: '#9BDEC8',
          400: '#5DCAA5',
          500: '#1D9E75',
          600: '#178561',
          700: '#176A51',
          800: '#17352E',
        },
        ink: '#17352E',
        muted: '#5F6F69',
        border: '#D9E8E3',
        soft: '#F8FBFA',
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 14px 40px rgba(23, 53, 46, 0.08)',
      },
      borderRadius: {
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
}
