import CheckCircleOutlineOutlined from '@mui/icons-material/CheckCircleOutlineOutlined';
import HourglassEmptyOutlined from '@mui/icons-material/HourglassEmptyOutlined';
import Alert from '@mui/material/Alert';
import { DividendEventItem, StockDividends } from '../../../api/types';
import { formatAmount, formatDate, formatFillDays, formatKind } from '../../../utils/format';

function latestEvent(stock: StockDividends): DividendEventItem | undefined {
    const [newestYear] = stock.years;
    return newestYear?.events[newestYear.events.length - 1];
}

function describeAmount(event: DividendEventItem): string {
    const parts: string[] = [];
    if(event.cashDividend > 0) parts.push(`現金 ${formatAmount(event.cashDividend)} 元`);
    if(event.stockDividend > 0) parts.push(`股票 ${formatAmount(event.stockDividend)} 元`);
    return parts.join('、');
}

/** The most recent ex-date and whether it has been filled yet, like the 除權息 banner on CMoney and Yahoo 股市. */
export default function LatestDividend({ stock }: { stock: StockDividends }) {
    const event = latestEvent(stock);
    if(!event) return null;

    const summary = `最近一次${formatKind(event.kind)}：${formatDate(event.exDate)}，${describeAmount(event)}，除權息前收盤價 ${formatAmount(event.preExClose)} 元`;
    if(event.filledDate !== null) {
        return (
            <Alert icon={<CheckCircleOutlineOutlined />} severity="success" variant="outlined" sx={{ borderColor: 'secondary.main', color: 'text.primary', '& .MuiAlert-icon': { color: 'secondary.main' } }}>
                {summary}，已於 {formatDate(event.filledDate)} 填權息（{formatFillDays(event.fillDayCount)}）。
            </Alert>
        );
    }
    return (
        <Alert icon={<HourglassEmptyOutlined />} severity="warning" variant="outlined" sx={{ color: 'text.primary' }}>
            {summary}，尚未填權息。
        </Alert>
    );
}
