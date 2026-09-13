/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0F172A',
        panel: '#1E293B',
        panelBorder: '#334155',
        muted: '#94A3B8',
        ink: '#E2E8F0',
        accent: '#F59E0B',
        ok: '#22C55E',
        warn: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
