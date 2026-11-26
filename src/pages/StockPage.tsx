import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router';
import DividendChart from '../features/stocks/components/DividendChart';
import DividendTable from '../features/stocks/components/DividendTable';
import LatestDividend from '../features/stocks/components/LatestDividend';
import Methodology from '../features/stocks/components/Methodology';
import StockHeader from '../features/stocks/components/StockHeader';
import StockSearch from '../features/stocks/components/StockSearch';
import SummaryCards from '../features/stocks/components/SummaryCards';
import { useRecentStocks } from '../features/stocks/hooks/use-recent-stocks';
import { useStockDividends } from '../features/stocks/hooks/use-stock-queries';
import { useDocumentTitle } from '../utils/use-document-title';

const SKELETON_CARD_COUNT = 4;

function LoadingState() {
    return (
        <Stack spacing={3} aria-busy="true" aria-label="載入中">
            <Skeleton variant="text" width="40%" height={56} />
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' } }}>
                {Array.from({ length: SKELETON_CARD_COUNT }, (_, index) => <Skeleton key={index} variant="rounded" height={132} />)}
            </Box>
            <Skeleton variant="rounded" height={360} />
            <Skeleton variant="rounded" height={320} />
        </Stack>
    );
}

function NotFoundState({ keyword }: { keyword: string }) {
    return (
        <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center', py: 6 }}>
            <Typography variant="h5" component="h1">查無「{keyword}」的除權息資料</Typography>
            <Typography color="text.secondary">
                請確認股票代號或名稱是否正確。新上市、沒有配過股利，或 2004 年以前就下市的股票不會有資料。
            </Typography>
            <Box sx={{ width: '100%', maxWidth: 520 }}>
                <StockSearch autoFocus />
            </Box>
            <Button component={RouterLink} to="/">回首頁</Button>
        </Stack>
    );
}

export default function StockPage() {
    const { stockId = '' } = useParams();
    const keyword = stockId.trim();
    const navigate = useNavigate();
    const { data: stock, isPending, isError, error, refetch, isFetching } = useStockDividends(keyword);
    const { addRecent } = useRecentStocks();

    useDocumentTitle(stock ? `${stock.idString} ${stock.name} 填權息、殖利率` : keyword);

    useEffect(() => {
        if(!stock) return;
        addRecent({ idString: stock.idString, name: stock.name });
        // A search by name ends up on the stock id, so the link to share is always the same.
        if(stock.idString !== keyword) navigate(`/stock/${stock.idString}`, { replace: true });
    }, [stock, keyword, addRecent, navigate]);

    let content;
    if(isPending) content = <LoadingState />;
    else if(isError) {
        content = (
            <Alert
                severity="error"
                action={<Button color="inherit" size="small" onClick={() => refetch()} disabled={isFetching}>重試</Button>}
            >
                {error.message}
            </Alert>
        );
    } else if(!stock) content = <NotFoundState keyword={keyword} />;
    else {
        content = (
            <Stack spacing={3}>
                <StockHeader stock={stock} />
                <LatestDividend stock={stock} />
                <SummaryCards stock={stock} />
                <DividendChart years={stock.years} />
                <DividendTable years={stock.years} />
                <Methodology />
            </Stack>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
            {content}
        </Container>
    );
}
