import FacebookIcon from '@mui/icons-material/Facebook';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SITE_NAME } from '../../utils/use-document-title';

const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=100057097043989';
const TWSE_URL = 'https://www.twse.com.tw/';
const TPEX_URL = 'https://www.tpex.org.tw/';

export default function AppFooter() {
    return (
        <Box component="footer" sx={{ borderTop: 1, borderColor: 'divider', py: 4, mt: 'auto' }}>
            <Container maxWidth="lg">
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { md: 'center' } }}>
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            資料來源：
                            <Link href={TWSE_URL} target="_blank" rel="noopener noreferrer" color="inherit">臺灣證券交易所</Link>
                            、
                            <Link href={TPEX_URL} target="_blank" rel="noopener noreferrer" color="inherit">證券櫃檯買賣中心</Link>
                            公開資料，每日收盤後更新。
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            本站資料僅供參考，不構成任何投資建議。
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                        <Link
                            href={FACEBOOK_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="hover"
                            sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
                        >
                            <FacebookIcon fontSize="small" />
                            粉絲專頁：問題與建議
                        </Link>
                        <Typography variant="body2" color="text.secondary">© {new Date().getFullYear()} {SITE_NAME}</Typography>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
}
