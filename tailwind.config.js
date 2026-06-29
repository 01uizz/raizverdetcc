/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // ── Verdes da floresta (protagonista) ──────────────────────────
        primary:                 '#08291b', // canopy profundo
        'primary-container':     '#11402a', // floresta
        'on-primary':            '#ffffff',
        'on-primary-container':  '#bfe7cb', // menta
        secondary:               '#2f8f58', // samambaia (verde moderno e vivo)
        'secondary-container':   '#cbeed6',
        'on-secondary':          '#ffffff',
        'on-secondary-container':'#13502f',
        // ── Realce seiva/lima — usar com parcimônia ────────────────────
        accent:                  '#8ccb4e',
        'accent-dark':           '#6fae39',
        'accent-light':          '#e3f1cb',
        // ── Tons quentes (terra / ciência / biodiversidade) ────────────
        sand:                    '#c8a06a',
        'sand-light':            '#f3ead8',
        clay:                    '#a9764a',
        bark:                    '#5b4632',
        canopy:                  '#0c3220',
        moss:                    '#7bb38b',
        // ── Superfícies (off-whites esverdeados) ───────────────────────
        surface:                 '#eaf3ec',
        'surface-container-low': '#e2efe6',
        'surface-container':     '#d6e9db',
        'surface-container-high':'#bcdcc6',
        'on-surface':            '#0d2417',
        'on-surface-variant':    '#3c5446',
        'outline-variant':       '#aecbb6',
        // ── Estado ─────────────────────────────────────────────────────
        error:                   '#ba1a1a',
        'error-container':       '#ffdad6',
        success:                 '#2f8f58',
        warning:                 '#9a6700',
        'warning-container':     '#fff0c7',
        background:              '#eaf3ec',
        'on-background':         '#0d2417',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        manrope: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        inter:   ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: { '4xl': '2rem', '5xl': '2.5rem' },
      boxShadow: {
        forest:    '0 4px 24px rgba(8, 41, 27, 0.10)',
        'forest-lg':'0 14px 50px rgba(8, 41, 27, 0.16)',
        'forest-xl':'0 28px 70px rgba(8, 41, 27, 0.24)',
        'glow-sap': '0 0 0 1px rgba(140,203,78,.4), 0 8px 30px rgba(140,203,78,.25)',
      },
      backgroundImage: {
        'forest-gradient': 'linear-gradient(135deg, #08291b 0%, #11402a 45%, #2f8f58 100%)',
        'leaf-gradient':   'linear-gradient(180deg, #f3f8f2 0%, #e2efe5 100%)',
        'canopy-radial':   'radial-gradient(130% 130% at 50% 0%, #11402a 0%, #08291b 62%)',
        'sap-gradient':    'linear-gradient(135deg, #2f8f58 0%, #8ccb4e 100%)',
      },
      keyframes: {
        'fade-up':   { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'fade-in':   { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'scale-in':  { '0%': { opacity: '0', transform: 'scale(.96)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        shimmer:     { '100%': { transform: 'translateX(100%)' } },
        progress:    { '0%': { width: '0%' }, '100%': { width: '100%' } },
        'sway':      { '0%,100%': { transform: 'rotate(-2deg)' }, '50%': { transform: 'rotate(2deg)' } },
      },
      animation: {
        'fade-up':  'fade-up .6s cubic-bezier(.16,1,.3,1) both',
        'fade-in':  'fade-in .5s ease both',
        'scale-in': 'scale-in .35s cubic-bezier(.16,1,.3,1) both',
        'sway':     'sway 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
