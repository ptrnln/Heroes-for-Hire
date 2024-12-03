/** @type {import('tailwindcss').Config} */


import { withAccountKitUi, createColorSet } from "@account-kit/react/tailwind";

// wrap your existing tailwind config with 'withAccountKitUi'
export default withAccountKitUi(
  {
    // your tailwind config here
    // docs on setting up tailwind here: https://tailwindcss.com/docs/installation/using-postcss
    content: [
      "./index.html", 
      './src/**/*.{js,jsx,ts,tsx}'
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  },
  {
    // override account kit themes
    colors: {
      "btn-primary": createColorSet("#E82594", "#FF66CC"),
      "fg-accent-brand": createColorSet("#E82594", "#FF66CC"),
    },
  },
);