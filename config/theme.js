/**
 * 颜色方案与主题配置
 * 统一管理应用的颜色体系，便于主题切换和维护
 */

// 主色调
export const PRIMARY_COLORS = {
  primary: '#2979ff',
  primaryLight: '#5e9bff',
  primaryDark: '#1a5cd6',
  primaryDisabled: '#a0c4ff'
}

// 功能色
export const FUNCTIONAL_COLORS = {
  success: '#19be6b',
  successLight: '#47d68e',
  warning: '#ff9900',
  warningLight: '#ffb84d',
  error: '#fa3534',
  errorLight: '#ff6b6b',
  info: '#909399',
  infoLight: '#b4b8bf'
}

// 中性色（文字、边框、背景）
export const NEUTRAL_COLORS = {
  // 文字颜色
  textPrimary: '#303133',
  textRegular: '#606266',
  textSecondary: '#909399',
  textPlaceholder: '#c0c4cc',
  textDisabled: '#c0c4cc',

  // 边框颜色
  borderBase: '#dcdfe6',
  borderLight: '#e4e7ed',
  borderLighter: '#ebeef5',
  borderExtraLight: '#f2f6fc',

  // 背景颜色
  bgWhite: '#ffffff',
  bgPage: '#f5f6f8',
  bgLight: '#fafafa',
  bgGray: '#f2f3f5',
  bgDark: '#1a1a1a',
  bgMask: 'rgba(0, 0, 0, 0.5)'
}

// 渐变色
export const GRADIENT_COLORS = {
  primaryGradient: 'linear-gradient(135deg, #2979ff, #1a5cd6)',
  successGradient: 'linear-gradient(135deg, #19be6b, #0fa65b)',
  warningGradient: 'linear-gradient(135deg, #ff9900, #e68a00)',
  errorGradient: 'linear-gradient(135deg, #fa3534, #d92c2c)',
  goldGradient: 'linear-gradient(135deg, #f7c948, #e6a817)',
  skyGradient: 'linear-gradient(135deg, #36cfc9, #13c2c2)'
}

// 暗黑模式颜色
export const DARK_COLORS = {
  textPrimary: '#e5eaf3',
  textRegular: '#cfd3dc',
  textSecondary: '#a3a6ad',
  textPlaceholder: '#8d9095',
  bgPage: '#0a0a0a',
  bgCard: '#1d1e1f',
  bgElevated: '#252526',
  borderBase: '#414243',
  borderLight: '#363637'
}

// 主题方案
export const THEMES = {
  light: {
    ...PRIMARY_COLORS,
    ...FUNCTIONAL_COLORS,
    ...NEUTRAL_COLORS,
    ...GRADIENT_COLORS,
    navBgColor: '#ffffff',
    navTextColor: '#303133',
    tabbarBgColor: '#ffffff',
    tabbarActiveColor: PRIMARY_COLORS.primary,
    tabbarInactiveColor: '#909399'
  },
  dark: {
    ...PRIMARY_COLORS,
    ...FUNCTIONAL_COLORS,
    ...DARK_COLORS,
    ...GRADIENT_COLORS,
    navBgColor: '#1d1e1f',
    navTextColor: '#e5eaf3',
    tabbarBgColor: '#1d1e1f',
    tabbarActiveColor: PRIMARY_COLORS.primary,
    tabbarInactiveColor: '#8d9095'
  }
}

/**
 * 获取主题配置
 * @param {string} theme - 主题名称 light | dark
 * @returns {object} 主题颜色配置
 */
export function getTheme(theme = 'light') {
  return THEMES[theme] || THEMES.light
}

/**
 * 将主题配置转换为 CSS 变量
 * @param {string} theme - 主题名称
 * @returns {string} CSS 变量字符串
 */
export function getThemeCssVars(theme = 'light') {
  const themeConfig = getTheme(theme)
  return Object.entries(themeConfig)
    .map(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      return `--theme-${cssKey}: ${value}`
    })
    .join('; ')
}

export default {
  PRIMARY_COLORS,
  FUNCTIONAL_COLORS,
  NEUTRAL_COLORS,
  GRADIENT_COLORS,
  DARK_COLORS,
  THEMES,
  getTheme,
  getThemeCssVars
}
