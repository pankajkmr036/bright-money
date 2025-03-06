const palette = {
  neutral900: "#FFFFFF", // White (reversed for dark mode)
  neutral800: "#F4F5F4", // Very light green-gray
  neutral700: "#E6EBE6", // Light green-gray
  neutral600: "#B6C5B6", // Medium light green-gray
  neutral500: "#7A8A7A", // Medium green-gray
  neutral400: "#5A6A5A", // Medium dark green-gray
  neutral300: "#3C463C", // Dark green-gray
  neutral200: "#252825", // Very dark green-gray (background in dark mode)
  neutral100: "#0F120F", // Almost black

  primary600: "#E3F9E7", // Very light green
  primary500: "#C7F3D0", // Light green
  primary400: "#86E698", // Medium light green
  primary300: "#4AD864", // Medium green
  primary200: "#00C928", // Main green
  primary100: "#00A021", // Dark green

  secondary500: "#E0F5E9", // Very light teal
  secondary400: "#C1EBDA", // Light teal
  secondary300: "#93D7BC", // Medium light teal
  secondary200: "#65C39E", // Medium teal
  secondary100: "#37AF80", // Teal

  accent500: "#FFF9E6", // Very light yellow
  accent400: "#FFEFC3", // Light yellow
  accent300: "#FFE59F", // Medium light yellow
  accent200: "#FFDB7B", // Medium yellow
  accent100: "#FFCA43", // Yellow

  angry100: "#F2D6CD",
  angry500: "#C03403",

  overlay20: "rgba(25, 16, 21, 0.2)",
  overlay50: "rgba(25, 16, 21, 0.5)",
} as const

export const colors = {
  palette,
  transparent: "rgba(0, 0, 0, 0)",
  text: palette.neutral800,
  textDim: palette.neutral600,
  background: palette.neutral200,
  border: palette.neutral400,
  tint: palette.primary500,
  tintInactive: palette.neutral300,
  separator: palette.neutral300,
  error: palette.angry500,
  errorBackground: palette.angry100,
} as const
