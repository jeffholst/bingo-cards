module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [

  ],
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
}
