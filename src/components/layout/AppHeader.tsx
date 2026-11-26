import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useLocation } from 'react-router';
import StockSearch from '../../features/stocks/components/StockSearch';
import { SITE_NAME } from '../../utils/use-document-title';
import ColorModeToggle from './ColorModeToggle';

const LOGO_SIZE = 32;

export default function AppHeader() {
    const { pathname } = useLocation();
    // The home page has its own large search box.
    const showSearch = pathname !== '/';

    return (
        <AppBar
            position="sticky"
            elevation={0}
            color="inherit"
            sx={(theme) => ({
                borderBottom: 1,
                borderColor: 'divider',
                backgroundColor: `rgba(${theme.vars?.palette.background.defaultChannel} / 0.85)`,
                backdropFilter: 'blur(12px)',
            })}
        >
            <Container maxWidth="lg">
                <Toolbar disableGutters sx={{ gap: 2, minHeight: { xs: 60, sm: 64 } }}>
                    <Box
                        component={RouterLink}
                        to="/"
                        sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary', textDecoration: 'none', flexShrink: 0 }}
                    >
                        <img src="/stock_icon.png" alt="" width={LOGO_SIZE} height={LOGO_SIZE} />
                        <Typography variant="h6" component="span" sx={{ display: { xs: showSearch ? 'none' : 'block', sm: 'block' } }}>
                            {SITE_NAME}
                        </Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                        {showSearch && (
                            <Box sx={{ width: '100%', maxWidth: 420 }}>
                                <StockSearch size="small" />
                            </Box>
                        )}
                    </Box>
                    <ColorModeToggle />
                </Toolbar>
            </Container>
        </AppBar>
    );
}
