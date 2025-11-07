/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    'postcss-color-functional-notation': { preserve: false },
    '@csstools/postcss-oklab-function': { preserve: false },
    '@tailwindcss/postcss': {},
  },
}

export default config
