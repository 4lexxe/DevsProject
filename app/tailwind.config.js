module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Rubik', 'sans-serif'], // Configurar Rubik como la fuente predeterminada
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),  // Para las clases 'prose'

    function({ addUtilities }) {
      const newUtilities = {
          '.resize-none': {
              resize: 'none',
          },
      }
      addUtilities(newUtilities, ['responsive', 'hover'])
    },
  ],
};
