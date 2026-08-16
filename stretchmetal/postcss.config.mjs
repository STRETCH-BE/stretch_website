// Tailwind CSS v4 runs entirely as a PostCSS plugin — no tailwind.config file;
// tokens live in app/globals.css under @theme.
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
