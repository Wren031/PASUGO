/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F97316',
          dark: '#C2410C',
          soft: '#FFEDD5',
          lighter: '#FDBA74',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F8FAFC',
          alt: '#F1F5F9',
        },
        ink: {
          DEFAULT: '#0F172A',
          secondary: '#475569',
          muted: '#94A3B8',
        },
        line: {
          DEFAULT: '#E2E8F0',
          strong: '#CBD5E1',
        },
        success: {
          DEFAULT: '#22C55E',
          soft: '#DCFCE7',
        },
        danger: {
          DEFAULT: '#EF4444',
          soft: '#FEE2E2',
        },
        warning: {
          DEFAULT: '#F59E0B',
          soft: '#FEF3C7',
        },
        info: {
          DEFAULT: '#3B82F6',
          soft: '#DBEAFE',
        },
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      spacing: {
        18: '72px',
      },
    },
  },
  plugins: [],
};
