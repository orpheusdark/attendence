import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b1020',
        panel: '#11182d',
        panelSoft: '#18213c',
        accent: '#6ee7ff',
        accent2: '#8b5cf6',
        success: '#34d399',
        danger: '#f87171'
      },
      boxShadow: {
        glass: '0 20px 60px rgba(0,0,0,0.35)'
      }
    }
  },
  plugins: []
};

export default config;