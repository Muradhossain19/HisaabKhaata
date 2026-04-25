export const authColors = {
  gradientStart: '#e8eeff',
  gradientMid: '#f4f6fb',
  gradientEnd: '#dde4ff',
  primary: '#4f46e5',
  primaryDark: '#4338ca',
  primaryLight: '#818cf8',
  surface: 'rgba(255,255,255,0.94)',
  surfaceBorder: 'rgba(148, 163, 184, 0.22)',
  text: '#0f172a',
  textMuted: '#64748b',
  textSubtle: '#94a3b8',
  border: '#e2e8f0',
  borderFocus: '#6366f1',
  inputBg: '#f8fafc',
  shadow: '#1e1b4b',
  error: '#dc2626',
} as const;

export const authGradientColors = [
  authColors.gradientStart,
  authColors.gradientMid,
  authColors.gradientEnd,
] as const;

export function authMetrics(width: number) {
  const horizontalPadding = Math.max(16, Math.min(28, Math.round(width * 0.055)));
  const cardMaxWidth = Math.min(432, width - horizontalPadding * 2);
  const cardRadius = width < 400 ? 20 : 24;
  const logoSize = Math.min(88, Math.max(72, Math.round(width * 0.19)));
  const titleSize = Math.min(30, Math.max(24, Math.round(width * 0.065 + 18)));
  const subtitleSize = width < 360 ? 14 : 15;
  return {
    horizontalPadding,
    cardMaxWidth,
    cardRadius,
    logoSize,
    titleSize,
    subtitleSize,
  };
}
