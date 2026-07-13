// Ganti file ini per klien untuk re-theme admin panel tanpa sentuh komponen.
// Dipakai sebagai CSS variables lewat <ThemeStyle /> di root layout admin.
export const theme = {
  bg: '#F4F1EA',
  panel: '#FFFFFF',
  border: '#E8E0D0',
  ink: '#2C1F0E',
  inkSoft: '#7A5C3A',
  inkFaint: '#A8926F',
  accent: '#C4853A',
  accentDark: '#9A6626',
  accentBg: '#FBF0DF',
  sidebar: '#2C1F0E',
  sidebarSoft: '#C9B79A',
  sidebarHover: '#3D2C15',
  green: '#4C7A3D',
  greenBg: '#EAF2E4',
  blue: '#3A5F8A',
  blueBg: '#E8EFF7',
  purple: '#6B4C8A',
  purpleBg: '#EFE7F5',
  red: '#A33A3A',
  redBg: '#F7E8E8',
  fontDisplay: "'Playfair Display', serif",
  fontBody: "'Inter', sans-serif",
} as const;

export type AdminTheme = typeof theme;
