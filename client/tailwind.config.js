module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Adjust the content paths based on your project structure
  ],
  theme: {
    extend: {
      keyframes: {
        "progress-width": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
      },
      animation: {
        "progress-bar": "progress-with 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
