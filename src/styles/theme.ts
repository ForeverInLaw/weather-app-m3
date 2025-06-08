'use client';

import { createTheme, responsiveFontSizes, PaletteOptions } from '@mui/material/styles';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

// Extend PaletteOptions to include Catppuccin specific colors for type safety
interface CatppuccinPalette {
  rosewater?: string;
  flamingo?: string;
  pink?: string;
  mauve?: string;
  red?: string;
  maroon?: string;
  peach?: string;
  yellow?: string;
  green?: string;
  teal?: string;
  sky?: string;
  sapphire?: string;
  blue?: string;
  lavender?: string;
  crust?: string;
  mantle?: string;
  base?: string;
  surface0?: string;
  surface1?: string;
  surface2?: string;
  overlay0?: string;
  overlay1?: string;
  overlay2?: string;
  subtext0?: string;
  subtext1?: string;
}

interface ExtendedPaletteOptions extends PaletteOptions, CatppuccinPalette {}


export const getAppTheme = (mode: 'light' | 'dark') => {
  let paletteOptions: ExtendedPaletteOptions;

  if (mode === 'light') {
    paletteOptions = {
      mode: 'light',
      primary: { main: '#4c4f69' }, // Catppuccin Latte Text color as primary
      secondary: { main: '#ea76cb' }, // Pink (can be reviewed if it still fits)
      error: { main: '#d20f39' }, // Red
      warning: { main: '#df8e1d' }, // Yellow
      info: { main: '#04a5e5' }, // Sky
      success: { main: '#40a02b' }, // Green
      background: { default: '#eff1f5', paper: '#e6e9ef' }, // Base, Mantle
      text: { primary: '#4c4f69', secondary: '#6c6f85' }, // Text, Subtext0
      divider: '#9ca0b0', // Overlay0
      // Catppuccin specific accents
      rosewater: '#dc8a78',
      flamingo: '#dd7878',
      peach: '#fe640b',
      maroon: '#e64553',
      teal: '#179299',
      sapphire: '#209fb5',
      blue: '#1e66f5',
      lavender: '#7287fd',
      crust: '#dce0e8',
      mantle: '#e6e9ef',
      base: '#eff1f5',
      surface0: '#ccd0da',
      surface1: '#bcc0cc',
      surface2: '#acb0be',
      overlay0: '#9ca0b0',
      overlay1: '#8c8fa1',
      overlay2: '#7c7f93',
      subtext0: '#6c6f85',
      subtext1: '#5c5f77',
    };
  } else {
    // Catppuccin Frappé Palette for Dark Mode
    paletteOptions = {
      mode: 'dark',
      primary: { main: '#babbf1' }, // Lavender (New Primary)
      secondary: { main: '#f4b8e4' }, // Pink
      error: { main: '#e78284' }, // Red
      warning: { main: '#e5c890' }, // Yellow
      info: { main: '#99d1db' }, // Sky
      success: { main: '#a6d189' }, // Green
      background: { default: '#303446', paper: '#292c3c' }, // Base, Mantle
      text: { primary: '#c6d0f5', secondary: '#a5adce' }, // Text, Subtext0
      divider: '#737994', // Overlay0
      // Catppuccin specific accents
      rosewater: '#f2d5cf',
      flamingo: '#eebabe',
      peach: '#ef9f76',
      maroon: '#ea999c',
      teal: '#81c8be',
      sapphire: '#85c1dc',
      blue: '#8caaee',
      lavender: '#babbf1',
      crust: '#232634',
      mantle: '#292c3c',
      base: '#303446',
      surface0: '#414559',
      surface1: '#51576d',
      surface2: '#626880',
      overlay0: '#737994',
      overlay1: '#838ba7',
      overlay2: '#949cbb',
      subtext0: '#a5adce',
      subtext1: '#b5bfe2',
    };
  }

  return createTheme({
    palette: paletteOptions,
    typography: {
      fontFamily: roboto.style.fontFamily,
      h1: { fontSize: '2.5rem', fontWeight: 700 },
      h2: { fontSize: '2rem', fontWeight: 700 },
      body1: { fontSize: '1rem', fontWeight: 400 },
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            textTransform: 'none',
            paddingTop: '8px',
            paddingBottom: '8px',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({ // Access theme for mode-specific styling
            backgroundColor: theme.palette.mode === 'light' 
              ? (theme.palette as ExtendedPaletteOptions).surface0 // Use Catppuccin Surface0 for cards in light mode
              : theme.palette.background.paper, // Default paper for dark mode cards
          }),
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: ({ theme }) => ({
            // Ensure Paper elements also use the correct background from Catppuccin Latte
            backgroundColor: theme.palette.mode === 'light' 
              ? (theme.palette as ExtendedPaletteOptions).mantle // Use Catppuccin Mantle for general Paper in light mode
              : theme.palette.background.paper, // Default paper for dark mode
          }),
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
    },
  });
};

const lightTheme = responsiveFontSizes(getAppTheme('light'));
export default lightTheme; 
// export { getAppTheme }; // getAppTheme is already exported via `export const getAppTheme`
