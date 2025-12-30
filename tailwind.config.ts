import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7A3FF2',
          dark: '#5B2CCB',
          light: '#B58BFF',
        },
        bg: {
          light: '#F5F7FA',
          card: '#FFFFFF',
        },
        text: {
          main: '#1A1A1A',
          muted: '#8E8E93',
        },
        success: '#2ECC71',
        danger: '#FF4D4F',
        warning: '#F5C542',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
