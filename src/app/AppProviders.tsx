import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import theme from '../theme/theme';
import { createQueryClient } from './query-client';

/** Categorical chart colors, validated for both color schemes (dataviz palette checks). */
const chartColors = {
    ':root': { '--chart-series-1': '#3d4fd1', '--chart-series-2': '#0f8f7e' },
    '.dark': { '--chart-series-1': '#7a88f2', '--chart-series-2': '#26ad9a' },
};

export default function AppProviders({ children }: { children: ReactNode }) {
    const [queryClient] = useState(createQueryClient);
    return (
        <ThemeProvider theme={theme} defaultMode="system">
            <CssBaseline enableColorScheme />
            <GlobalStyles styles={chartColors} />
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </ThemeProvider>
    );
}
