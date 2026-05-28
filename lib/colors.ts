export const Colors = {
  // Brand
  orange: "#FC4C02",
  orangeLight: "#FF6B35",
  orangeDim: "rgba(252,76,2,0.15)",

  // Backgrounds
  bg: "#0A0A0A",
  bgCard: "#141414",
  bgElevated: "#1C1C1C",
  bgModal: "#1A1A1A",

  // Borders
  border: "rgba(255,255,255,0.08)",
  borderStrong: "rgba(255,255,255,0.15)",

  // Text
  text: "#FFFFFF",
  textSecondary: "#A0A0A0",
  textMuted: "#606060",

  // Sport type colors
  run: "#FC4C02",
  ride: "#2E86AB",
  walk: "#44BBA4",
  hike: "#8BC34A",
  swim: "#5BC0EB",

  // State
  success: "#4CAF50",
  warning: "#FF9800",
  error: "#F44336",
  premium: "#FFD700",
} as const;

export const Fonts = {
  display: "SpaceGrotesk",
  body: "Inter",
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const Shadow = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  orange: {
    shadowColor: "#FC4C02",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;
