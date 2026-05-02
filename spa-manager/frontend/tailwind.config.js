/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        cream: 'var(--cream)',
        bone: 'var(--bone)',
        line: 'var(--line)',
        ink: 'var(--ink)',
        terra: 'var(--terra)',
        olive: 'var(--olive)',
        danger: 'var(--danger)',
      },
      fontFamily: {
        sans: ['Inter Tight', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
