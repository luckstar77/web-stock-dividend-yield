import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Fragment, useState } from 'react';
import { DividendEventItem, DividendYear } from '../../../api/types';
import { formatAmount, formatDate, formatFillDays, formatKind, formatPercent } from '../../../utils/format';

const NUMERIC_CELL = { fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' } as const;
const STICKY_CELL = { position: 'sticky', left: 0, zIndex: 1, backgroundColor: 'background.paper' } as const;
/** Like Goodinfo and 財報狗: the recent years first, the full history on request. */
export const INITIAL_YEAR_COUNT = 10;

/** A year is filled once its last ex-date is filled, so the year takes the longest wait of its ex-dates. */
function yearFillDays(year: DividendYear): number | null {
    if(!year.isFilled) return null;
    return Math.max(...year.events.map((event) => event.fillDayCount ?? 0));
}

function FillChip({ filled }: { filled: boolean }) {
    return filled
        ? <Chip size="small" label="已填權息" color="secondary" variant="outlined" />
        : <Chip size="small" label="未填權息" color="warning" variant="outlined" />;
}

function EventRows({ events }: { events: DividendEventItem[] }) {
    return (
        <Table size="small" aria-label="各次除權息">
            <TableHead>
                <TableRow>
                    <TableCell>除權息日</TableCell>
                    <TableCell>類型</TableCell>
                    <TableCell align="right">除權息前收盤</TableCell>
                    <TableCell align="right">現金股利</TableCell>
                    <TableCell align="right">股票股利</TableCell>
                    <TableCell>填權息日</TableCell>
                    <TableCell align="right">填息天數</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {events.map((event, index) => (
                    // A stock could in theory have an ex-date in each market on the same day.
                    <TableRow key={`${event.exDate}-${index}`}>
                        <TableCell sx={NUMERIC_CELL}>{formatDate(event.exDate)}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatKind(event.kind)}</TableCell>
                        <TableCell align="right" sx={NUMERIC_CELL}>{formatAmount(event.preExClose)}</TableCell>
                        <TableCell align="right" sx={NUMERIC_CELL}>{formatAmount(event.cashDividend)}</TableCell>
                        <TableCell align="right" sx={NUMERIC_CELL}>
                            {formatAmount(event.stockDividend)}{event.isAmountEstimated && <sup title="配股數由交易所表格推算">＊</sup>}
                        </TableCell>
                        <TableCell sx={NUMERIC_CELL}>{event.filledDate ? formatDate(event.filledDate) : '—'}</TableCell>
                        <TableCell align="right" sx={NUMERIC_CELL}>{formatFillDays(event.fillDayCount)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

function YearRow({ year }: { year: DividendYear }) {
    const [open, setOpen] = useState(false);
    const isEstimated = year.events.some((event) => event.isAmountEstimated);
    const label = `${year.year} 年的 ${year.events.length} 次除權息`;

    return (
        <Fragment>
            <TableRow hover onClick={() => setOpen(!open)} sx={{ cursor: 'pointer', '& > td': { borderBottom: open ? 'none' : undefined } }}>
                <TableCell sx={{ ...STICKY_CELL, ...NUMERIC_CELL, fontWeight: 700, py: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <IconButton size="small" aria-label={open ? `收合${label}` : `展開${label}`} aria-expanded={open}>
                            {open ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" />}
                        </IconButton>
                        {year.year}
                    </Box>
                </TableCell>
                <TableCell align="right" sx={NUMERIC_CELL}>{formatAmount(year.cashDividend)}</TableCell>
                <TableCell align="right" sx={NUMERIC_CELL}>
                    {formatAmount(year.stockDividend)}{isEstimated && <sup title="配股數由交易所表格推算">＊</sup>}
                </TableCell>
                <TableCell align="right" sx={NUMERIC_CELL}>{formatPercent(year.cashYieldRatio)}</TableCell>
                <TableCell align="right" sx={NUMERIC_CELL}>{formatPercent(year.retroactiveYieldRatio)}</TableCell>
                <TableCell align="center"><FillChip filled={year.isFilled} /></TableCell>
                <TableCell align="right" sx={NUMERIC_CELL}>{formatFillDays(yearFillDays(year))}</TableCell>
                <TableCell align="right" sx={NUMERIC_CELL}>{year.events.length}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={8} sx={{ py: 0, ...(open ? {} : { borderBottom: 'none' }) }}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ py: 1.5, pl: { sm: 5 } }}>
                            <EventRows events={year.events} />
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </Fragment>
    );
}

export default function DividendTable({ years }: { years: DividendYear[] }) {
    const [showAll, setShowAll] = useState(false);
    const hasEstimate = years.some((year) => year.events.some((event) => event.isAmountEstimated));
    const hiddenCount = years.length - INITIAL_YEAR_COUNT;
    const shownYears = showAll || hiddenCount <= 0 ? years : years.slice(0, INITIAL_YEAR_COUNT);

    return (
        <Card>
            <CardContent sx={{ pb: 1 }}>
                <Typography variant="h6" component="h2">歷年除權息明細</Typography>
                <Typography variant="body2" color="text.secondary">點選年度可展開每一次除權息與填息天數</Typography>
            </CardContent>
            <TableContainer>
                <Table size="small" aria-label="歷年除權息明細" sx={{ minWidth: 720 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={STICKY_CELL}>年度</TableCell>
                            <TableCell align="right">現金股利</TableCell>
                            <TableCell align="right">股票股利</TableCell>
                            <TableCell align="right">現金殖利率</TableCell>
                            <TableCell align="right">還原殖利率</TableCell>
                            <TableCell align="center">填權息</TableCell>
                            <TableCell align="right">填息天數</TableCell>
                            <TableCell align="right">次數</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {shownYears.map((year) => <YearRow key={year.year} year={year} />)}
                    </TableBody>
                </Table>
            </TableContainer>
            {hiddenCount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1.5 }}>
                    <Button onClick={() => setShowAll(!showAll)} endIcon={showAll ? <KeyboardArrowUp /> : <KeyboardArrowDown />}>
                        {showAll ? `只顯示最近 ${INITIAL_YEAR_COUNT} 年` : `顯示全部 ${years.length} 年`}
                    </Button>
                </Box>
            )}
            <CardContent sx={{ pt: 1.5 }}>
                <Typography variant="caption" color="text.secondary" component="p">
                    股利單位為元／股；股票股利以面額 10 元換算。填息天數為日曆天，一年有多次除權息時取最晚填權息的那次。
                    {hasEstimate && ' ＊ 交易所查無詳細資料，配股數由除權息計算結果表推算。'}
                </Typography>
            </CardContent>
        </Card>
    );
}
