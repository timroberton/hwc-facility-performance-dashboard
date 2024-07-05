const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

const { _KEY_COLORS } = require("./src/key_colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    colors: {
      transparent: colors.transparent,
      black: colors.black,
      white: colors.white,
      //
      "base-100": _KEY_COLORS.base100,
      "base-200": _KEY_COLORS.base200,
      "base-300": _KEY_COLORS.base300,
      "base-content": _KEY_COLORS.baseContent,
      "base-content-lighter": _KEY_COLORS.baseContentLessVisible,
      //
      primary: _KEY_COLORS.primary,
      "primary-content": _KEY_COLORS.primaryContent,
      //
      neutral: colors.slate[500],
      "neutral-content": colors.white,
      //
      success: colors.emerald[500],
      "success-content": colors.white,
      //
      danger: colors.red[500],
      "danger-content": colors.white,
    },
    borderRadius: {
      DEFAULT: "3px",
      full: 9999,
    },
    fontFamily: {
      sans: ["'Roboto Condensed'", ...defaultTheme.fontFamily.sans],
    },
    fontWeight: {
      [400]: 400,
      [700]: 700,
    },
    data: {
      primary: 'intent~="primary"',
      neutral: 'intent~="neutral"',
      success: 'intent~="success"',
      danger: 'intent~="danger"',
    },
  },
  plugins: [
    require("@tailwindcss/container-queries"),
    require("@kobalte/tailwindcss"),
  ],
};
