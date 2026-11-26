import ShareOutlined from '@mui/icons-material/ShareOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { StockDividends } from '../../../api/types';
import { formatDate, formatMarket } from '../../../utils/format';

interface StockHeaderProps {
    stock: StockDividends;
}

const SNACKBAR_MS = 2500;

export default function StockHeader({ stock }: StockHeaderProps) {
    const [message, setMessage] = useState('');
    const market = formatMarket(stock.market);

    const share = async () => {
        const url = window.location.href;
        const title = `${stock.idString} ${stock.name} 歷年除權息 - 權息通`;
        try {
            if(navigator.share) {
                await navigator.share({ title, url });
                return;
            }
            await navigator.clipboard.writeText(url);
            setMessage('已複製連結');
        } catch(error) {
            if(error instanceof DOMException && error.name === 'AbortError') return;
            setMessage('無法分享，請直接複製網址');
        }
    };

    return (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { sm: 'flex-end' } }}>
            <Box>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap' }} useFlexGap>
                    <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
                        <Box component="span" sx={{ fontVariantNumeric: 'tabular-nums', mr: 1.5 }}>{stock.idString}</Box>
                        {stock.name}
                    </Typography>
                    {market && <Chip size="small" label={market} color="primary" variant="outlined" />}
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    統計 {stock.dividendYearStart}–{stock.dividendYearEnd} 年 · 收盤價檢查至 {formatDate(stock.dataThroughDate)}
                </Typography>
            </Box>
            <Button variant="outlined" startIcon={<ShareOutlined />} onClick={share} sx={{ alignSelf: { xs: 'flex-start', sm: 'auto' } }}>
                分享
            </Button>
            <Snackbar open={message !== ''} autoHideDuration={SNACKBAR_MS} onClose={() => setMessage('')} message={message} />
        </Stack>
    );
}
