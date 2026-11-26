import Box from '@mui/material/Box';
import { Outlet, ScrollRestoration } from 'react-router';
import AppFooter from './AppFooter';
import AppHeader from './AppHeader';

export default function Layout() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
            <AppHeader />
            <Box component="main" sx={{ flexGrow: 1 }}>
                <Outlet />
            </Box>
            <AppFooter />
            <ScrollRestoration />
        </Box>
    );
}
