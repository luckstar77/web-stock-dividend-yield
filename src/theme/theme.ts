import { createTheme } from '@mui/material/styles';

const FONT_FAMILY = '"Noto Sans TC", system-ui, -apple-system, "Segoe UI", "PingFang TC", "Microsoft JhengHei", sans-serif';
const BORDER_RADIUS = 12;

/**
 * Indigo for the brand (the earlier site used #556cd6) and teal for "filled".
 * Red and green are left out on purpose: on Taiwanese quote screens they mean up and down.
 */
const theme = createTheme({
    cssVariables: { colorSchemeSelector: 'class' },
    colorSchemes: {
        light: {
            palette: {
                primary: { main: '#3d4fd1' },
                secondary: { main: '#0f8f7e' },
                warning: { main: '#e08a00' },
                background: { default: '#f5f6fa', paper: '#ffffff' },
                text: { primary: '#1b1f2a', secondary: '#5b6272' },
                divider: '#e3e6ee',
            },
        },
        dark: {
            palette: {
                primary: { main: '#8f9cff' },
                secondary: { main: '#4fd1bd' },
                warning: { main: '#ffb74d' },
                background: { default: '#0e1320', paper: '#161c2c' },
                text: { primary: '#e8eaf2', secondary: '#a3a9ba' },
                divider: '#273047',
            },
        },
    },
    shape: { borderRadius: BORDER_RADIUS },
    typography: {
        fontFamily: FONT_FAMILY,
        h1: { fontWeight: 700 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 700 },
        h4: { fontWeight: 700 },
        h5: { fontWeight: 700 },
        h6: { fontWeight: 700 },
        button: { textTransform: 'none', fontWeight: 500 },
    },
    components: {
        MuiCard: {
            defaultProps: { variant: 'outlined' },
        },
        MuiPaper: {
            styleOverrides: {
                outlined: { borderColor: 'var(--mui-palette-divider)' },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: { fontWeight: 500 },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: { fontWeight: 700, whiteSpace: 'nowrap' },
            },
        },
    },
});

export default theme;
