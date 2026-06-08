/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        clash: ['"Clash Display"', 'sans-serif'],
        satoshi: ['Satoshi', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'hero': ['clamp(64px,8.5vw,120px)', { lineHeight: '0.92', letterSpacing: '-0.04em' }],
        'section': ['clamp(40px,5vw,72px)', { lineHeight: '1.0', letterSpacing: '-0.03em' }],
        'xl-body': ['20px', { lineHeight: '1.65' }],
        'nav-size': ['16px', { lineHeight: '1.5' }],
        'label-sm': ['14px', { lineHeight: '1.5' }],
        'desc': ['24px', { lineHeight: '1.5' }],
      },
      colors: {
        bg: '#000000',
        surface: '#0a0a0a',
        border: 'rgba(255,255,255,0.08)',
        primary: '#ffffff',
        secondary: 'rgba(255,255,255,0.5)',
        muted: 'rgba(255,255,255,0.25)',
        accent: '#4FC3F7',
      },
      letterSpacing: {
        tightest: '-0.05em',
      },
    },
  },
  plugins: [],
};
