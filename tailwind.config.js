/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "#08080a",
        foreground: "#f4f4f5",
        obsidian: {
          950: "#040405",
          900: "#08080a",
          850: "#0d0d11",
          800: "#121217",
          700: "#1a1a22",
          600: "#262633",
        },
        gold: {
          100: "#fdf8e6",
          200: "#f9ecc2",
          300: "#f4dc93",
          400: "#e9c65d",
          500: "#d4af37", // Signature Atelier Gold
          600: "#b38f26",
          700: "#8e6d19",
          800: "#6a4f13",
          900: "#47340b",
        },
        cyber: {
          cyan: "#00f0ff",
          purple: "#9d4edd",
          rose: "#ff007f",
          amber: "#ffaa00",
        },
        titanium: {
          100: "#f1f1f4",
          200: "#dcdce2",
          300: "#b9b9c6",
          400: "#8d8d9f",
          500: "#656578",
          600: "#494957",
        }
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        display: ['var(--font-cinzel)', 'Georgia', 'serif'],
        mono: ['var(--font-space-mono)', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gold-shimmer': 'linear-gradient(135deg, #f4dc93 0%, #d4af37 50%, #8e6d19 100%)',
        'dark-glass': 'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
        'glow-radial': 'radial-gradient(circle at center, rgba(212, 175, 55, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(212, 175, 55, 0.35)',
        'cyan-glow': '0 0 25px -5px rgba(0, 240, 255, 0.35)',
        'purple-glow': '0 0 25px -5px rgba(157, 78, 221, 0.35)',
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
        'inner-light': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
};
