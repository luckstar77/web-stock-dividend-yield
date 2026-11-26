import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { StockOption } from '../api/types';
import MetricGuide from '../features/stocks/components/MetricGuide';
import StockChips from '../features/stocks/components/StockChips';
import StockSearch from '../features/stocks/components/StockSearch';
import { useRecentStocks } from '../features/stocks/hooks/use-recent-stocks';
import { useDocumentTitle } from '../utils/use-document-title';

const LOGO_SIZE = 72;

/** Stocks and ETFs that dividend investors look up most. */
const POPULAR_STOCKS: StockOption[] = [
    { idString: '0056', name: '元大高股息' },
    { idString: '00878', name: '國泰永續高股息' },
    { idString: '00919', name: '群益台灣精選高息' },
    { idString: '0050', name: '元大台灣50' },
    { idString: '2330', name: '台積電' },
    { idString: '2412', name: '中華電' },
    { idString: '2884', name: '玉山金' },
    { idString: '2886', name: '兆豐金' },
];

export default function HomePage() {
    useDocumentTitle();
    const { recent, clearRecent } = useRecentStocks();

    return (
        <>
            <Box
                component="section"
                sx={(theme) => ({
                    py: { xs: 6, md: 10 },
                    background: `radial-gradient(1200px 400px at 50% -10%, rgba(${theme.vars?.palette.primary.mainChannel} / 0.14), transparent 70%)`,
                })}
            >
                <Container maxWidth="md">
                    <Stack spacing={3} sx={{ alignItems: 'center', textAlign: 'center' }}>
                        <img src="/stock_icon.png" alt="權息通" width={LOGO_SIZE} height={LOGO_SIZE} />
                        <Box>
                            <Typography variant="h3" component="h1" sx={{ fontSize: { xs: '2rem', md: '2.75rem' }, mb: 1 }}>
                                台股填權息查詢
                            </Typography>
                            <Typography variant="h6" component="p" color="text.secondary" sx={{ fontWeight: 400, fontSize: { xs: '1rem', md: '1.15rem' } }}>
                                一次看懂個股與 ETF 的歷年除權息、填息天數與殖利率
                            </Typography>
                        </Box>
                        <Box sx={{ width: '100%', maxWidth: 640 }}>
                            <StockSearch autoFocus />
                        </Box>
                        <Stack spacing={1.5}>
                            <StockChips title="熱門" stocks={POPULAR_STOCKS} />
                            <StockChips
                                title="最近查詢"
                                stocks={recent}
                                action={<Button size="small" onClick={clearRecent}>清除</Button>}
                            />
                        </Stack>
                    </Stack>
                </Container>
            </Box>
            <Container maxWidth="lg" component="section" sx={{ pb: 8 }}>
                <Typography variant="h5" component="h2" sx={{ mb: 2 }}>怎麼看這些數字</Typography>
                <MetricGuide />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    統計自上市 2004 年 2 月、上櫃 2007 年 12 月起的除權息紀錄，每個交易日收盤後更新。現金增資不是股利，不列入計算。
                </Typography>
            </Container>
        </>
    );
}
