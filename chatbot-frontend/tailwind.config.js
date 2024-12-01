module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary-color)",
        primaryHover: "var(--primary-hover)",
        primaryFocus: "var(--primary-focus)",
        secondary: "var(--secondary-color)",
        secondaryHover: "var(--secondary-hover)",
        accent: "var(--accent-color)",
        accentHover: "var(--accent-hover)",
        lightGray: "var(--light-gray)",
        darkBackground: "var(--dark-chatbox-background)",
        darkBorder: "var(--dark-chatbox-border)",
        darkHeading: "var(--dark-chatbox-heading-background)",
        darkText: "var(--dark-chatbox-heading-color)",
      },
      animation: {
        blink: "blink 1.4s infinite",
        fadeInSlideDown: "fadeInSlideDown 0.3s ease-out",
      },
      keyframes: {
        fadeInSlideDown: {
          "0%": { opacity: 0, transform: "translateY(-10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  darkMode: "class", 
  plugins: [],
};
