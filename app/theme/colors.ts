const palette = {
  neutral100: "#FFFFFF", // White (background of card)
  neutral200: "#F4F5F4", // Very light green-gray (background)
  neutral300: "#E6EBE6", // Light green-gray (progress bar background)
  neutral400: "#B6C5B6", // Medium light green-gray
  neutral500: "#7A8A7A", // Medium green-gray
  neutral600: "#5A6A5A", // Medium dark green-gray
  neutral700: "#3C463C", // Dark green-gray
  neutral800: "#252825", // Very dark green-gray
  neutral900: "#0F120F", // Almost black

  // Primary green colors
  primary100: "#E3F9E7", // Very light green
  primary200: "#C7F3D0", // Light green
  primary300: "#86E698", // Medium light green
  primary400: "#4AD864", // Medium green
  primary500: "#00C928", // Main green (buttons, progress)
  primary600: "#00A021", // Dark green

  // Secondary colors
  secondary100: "#E0F5E9", // Very light teal
  secondary200: "#C1EBDA", // Light teal
  secondary300: "#93D7BC", // Medium light teal
  secondary400: "#65C39E", // Medium teal
  secondary500: "#37AF80", // Teal

  // Accent colors (optional)
  accent100: "#FFF9E6", // Very light yellow
  accent200: "#FFEFC3", // Light yellow
  accent300: "#FFE59F", // Medium light yellow
  accent400: "#FFDB7B", // Medium yellow
  accent500: "#FFCA43", // Yellow

  angry100: "#F2D6CD",
  angry500: "#C03403",

  overlay20: "rgba(15, 18, 15, 0.2)",
  overlay50: "rgba(15, 18, 15, 0.5)",
} as const

export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,
  /**
   * A helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The default text color in many components.
   */
  text: palette.neutral800,
  /**
   * Secondary text information.
   */
  textDim: palette.neutral600,
  /**
   * The default color of the screen background.
   */
  background: palette.neutral200,
  /**
   * The default border color.
   */
  border: palette.neutral300,
  /**
   * The main tinting color.
   */
  tint: palette.primary500,
  /**
   * The inactive tinting color.
   */
  tintInactive: palette.neutral300,
  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral300,
  /**
   * Error messages.
   */
  error: palette.angry500,
  /**
   * Error Background.
   */
  errorBackground: palette.angry100,
} as const
