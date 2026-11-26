import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';
import { StockDividends } from '../../../api/types';
import { formatAmount, formatDate, formatPercent } from '../../../utils/format';

interface StatCardProps {
    label: string;
    value: string;
    caption: ReactNode;
    hint: string;
    children?: ReactNode;
}

function StatCard({ label, value, caption, hint, children }: StatCardProps) {
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Tooltip title={hint} placement="top-start">
                    <Typography variant="body2" color="text.secondary" sx={{ cursor: 'help', width: 'fit-content', borderBottom: '1px dotted', borderColor: 'divider' }}>
                        {label}
                    </Typography>
                </Tooltip>
                <Typography
                    component="p"
                    sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' }, fontWeight: 700, lineHeight: 1.3, my: 0.5, fontVariantNumeric: 'tabular-nums' }}
                >
                    {value}
                </Typography>
                {children}
                <Typography variant="body2" color="text.secondary">{caption}</Typography>
            </CardContent>
        </Card>
    );
}

interface SummaryCardsProps {
    stock: StockDividends;
}

export default function SummaryCards({ stock }: SummaryCardsProps) {
    const trailingCaption = stock.lastClose === null
        ? '收盤價會在下次資料更新後提供'
        : `近一年現金股利 ${formatAmount(stock.trailingCashDividend)} 元 ÷ ${formatDate(stock.lastCloseDate)} 收盤價 ${formatAmount(stock.lastClose)} 元`;

    return (
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' } }}>
            <StatCard
                label="填權息成功率"
                value={formatPercent(stock.successRatio)}
                caption={`${stock.dividendYearCount} 年中有 ${stock.filledYearCount} 年填權息`}
                hint="一年內每次除權息都填權息，那一年才算成功"
            >
                <LinearProgress
                    variant="determinate"
                    value={Math.min(Math.max(stock.successRatio, 0), 100)}
                    color="secondary"
                    sx={{ height: 6, borderRadius: 3, mb: 1 }}
                    aria-label="填權息成功率"
                />
            </StatCard>
            <StatCard
                label="平均現金殖利率"
                value={formatPercent(stock.avgCashYieldRatio)}
                caption={`${stock.dividendYearStart}–${stock.dividendYearEnd} 年平均`}
                hint="每年的現金股利 ÷ 除權息前收盤價，再把各年平均"
            />
            <StatCard
                label="平均還原殖利率"
                value={formatPercent(stock.avgRetroactiveYieldRatio)}
                caption="含股票股利的價值"
                hint="配股以除權息參考價換算成價值，與現金股利一起計算，再把各年平均"
            />
            <StatCard
                label="近一年現金殖利率"
                value={formatPercent(stock.trailingCashYieldRatio)}
                caption={trailingCaption}
                hint="最近 365 天內除息的現金股利合計 ÷ 最新收盤價"
            />
        </Box>
    );
}
