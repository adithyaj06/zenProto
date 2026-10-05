import { createTheme } from '@mui/material/styles'

export const TOKEN_KEY = 'zenproto_token'
export const THEME_MODE_KEY = 'zenproto_theme_mode'
export const THEME_FONT_KEY = 'zenproto_theme_font'

export const themeOptions = {
  dawn: { label: 'Dawn', mode: 'light', primary: '#c75c3c', secondary: '#397c75', background: '#fffaf4', paper: '#ffffff', swatch: '#c75c3c' },
  midnight: { label: 'Midnight', mode: 'dark', primary: '#8ec5ff', secondary: '#f4b860', background: '#101827', paper: '#182538', swatch: '#182538' },
  forest: { label: 'Forest', mode: 'light', primary: '#34745a', secondary: '#b27b3c', background: '#f4f8f1', paper: '#ffffff', swatch: '#34745a' },
  ocean: { label: 'Ocean', mode: 'light', primary: '#087e8b', secondary: '#f3a712', background: '#f1fbfc', paper: '#ffffff', swatch: '#087e8b' },
  lavender: { label: 'Lavender', mode: 'light', primary: '#7057a3', secondary: '#d26a8a', background: '#faf8ff', paper: '#ffffff', swatch: '#7057a3' },
  sunset: { label: 'Sunset', mode: 'dark', primary: '#ff9f68', secondary: '#ffd166', background: '#24161b', paper: '#332027', swatch: '#d85c45' },
  rose: { label: 'Rose', mode: 'light', primary: '#b84c68', secondary: '#5c7894', background: '#fff7f8', paper: '#ffffff', swatch: '#b84c68' }
}

export const fontOptions = {
  system: { label: 'System', family: 'system-ui, sans-serif' },
  modern: { label: 'Modern', family: 'Arial, sans-serif' },
  humanist: { label: 'Humanist', family: 'Trebuchet MS, sans-serif' },
  clean: { label: 'Clean', family: 'Verdana, sans-serif' },
  classic: { label: 'Classic', family: 'Georgia, serif' },
  editorial: { label: 'Editorial', family: 'Palatino Linotype, Book Antiqua, serif' },
  book: { label: 'Book', family: 'Garamond, Times New Roman, serif' },
  typewriter: { label: 'Typewriter', family: 'Courier New, monospace' },
  mono: { label: 'Mono', family: 'Consolas, monospace' },
  rounded: { label: 'Rounded', family: 'Arial Rounded MT Bold, Arial, sans-serif' },
  narrow: { label: 'Narrow', family: 'Tahoma, sans-serif' },
  display: { label: 'Display', family: 'Impact, Haettenschweiler, sans-serif' }
}

export function getInitialTheme() {
  const savedTheme = localStorage.getItem(THEME_MODE_KEY)
  if (savedTheme === 'dark') return 'midnight'
  if (savedTheme === 'light') return 'dawn'
  return savedTheme && themeOptions[savedTheme] ? savedTheme : 'dawn'
}

export function createAppTheme(themeKey, fontKey) {
  const selectedTheme = themeOptions[themeKey]
  const selectedFont = fontOptions[fontKey] || fontOptions.system

  return createTheme({
    palette: {
      mode: selectedTheme.mode,
      primary: { main: selectedTheme.primary },
      secondary: { main: selectedTheme.secondary },
      background: { default: selectedTheme.background, paper: selectedTheme.paper }
    },
    typography: { fontFamily: selectedFont.family },
    shape: { borderRadius: 20 },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: { borderRadius: 20 }
        }
      },
      MuiDialog: {
        styleOverrides: {
          paper: { borderRadius: 24 }
        }
      }
    }
  })
}
