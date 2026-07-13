import { theme } from '@/lib/admin/theme.config';

// Taruh <ThemeStyle /> sekali di app/admin/(protected)/layout.tsx dan
// app/admin/login/page.tsx. Semua komponen admin lain pakai var(--xxx),
// bukan hex langsung, supaya ganti theme.config.ts otomatis ke-apply.
export default function ThemeStyle() {
  const vars = `
    --bg: ${theme.bg};
    --panel: ${theme.panel};
    --border: ${theme.border};
    --ink: ${theme.ink};
    --ink-soft: ${theme.inkSoft};
    --ink-faint: ${theme.inkFaint};
    --accent: ${theme.accent};
    --accent-dark: ${theme.accentDark};
    --accent-bg: ${theme.accentBg};
    --sidebar: ${theme.sidebar};
    --sidebar-soft: ${theme.sidebarSoft};
    --sidebar-hover: ${theme.sidebarHover};
    --green: ${theme.green};
    --green-bg: ${theme.greenBg};
    --blue: ${theme.blue};
    --blue-bg: ${theme.blueBg};
    --purple: ${theme.purple};
    --purple-bg: ${theme.purpleBg};
    --red: ${theme.red};
    --red-bg: ${theme.redBg};
    --font-display: ${theme.fontDisplay};
    --font-body: ${theme.fontBody};
  `;
  return <style dangerouslySetInnerHTML={{ __html: `:root { ${vars} }` }} />;
}
