import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DividendYear } from '../../../api/types';
import { formatAmount, formatPercent } from '../../../utils/format';

/** Chart colors are CSS variables so they follow the color scheme (see GlobalStyles in providers). */
const SERIES_1 = 'var(--chart-series-1)';
const SERIES_2 = 'var(--chart-series-2)';
const SURFACE = 'var(--mui-palette-background-paper)';
const GRID = 'var(--mui-palette-divider)';
const AXIS_TEXT = 'var(--mui-palette-text-secondary)';
const CHART_HEIGHT = 300;
const BAR_RADIUS: [number, number, number, number] = [4, 4, 0, 0];
const AXIS_FONT_SIZE = 12;

type ChartView = 'amount' | 'yield';

interface ChartRow {
    year: number;
    cashDividend: number;
    stockDividend: number;
    cashYieldRatio: number;
    retroactiveYieldRatio: number;
}

interface TooltipEntry {
    name?: string | number;
    value?: number | string | readonly (number | string)[];
    color?: string;
}

interface ChartTooltipProps {
    active?: boolean;
    label?: string | number;
    payload?: readonly TooltipEntry[];
    format: (value: number) => string;
}

function ChartTooltip({ active, label, payload, format }: ChartTooltipProps) {
    if(!active || !payload || payload.length === 0) return null;
    return (
        <Paper variant="outlined" sx={{ px: 1.5, py: 1, boxShadow: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>{label} 年</Typography>
            {payload.map((entry) => (
                <Stack key={String(entry.name)} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: 0.5, backgroundColor: entry.color }} />
                    <Typography variant="body2" color="text.secondary">{entry.name}</Typography>
                    <Typography variant="body2" sx={{ ml: 'auto', pl: 2, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                        {typeof entry.value === 'number' ? format(entry.value) : '—'}
                    </Typography>
                </Stack>
            ))}
        </Paper>
    );
}

/** Legend labels wear the text color; the swatch next to them carries the series color. */
function legendText(value: string) {
    return <span style={{ color: AXIS_TEXT }}>{value}</span>;
}

const axisProps = {
    stroke: GRID,
    tick: { fill: AXIS_TEXT, fontSize: AXIS_FONT_SIZE },
    tickLine: false,
};

export default function DividendChart({ years }: { years: DividendYear[] }) {
    const [view, setView] = useState<ChartView>('amount');
    // The API lists the newest year first; a chart over time reads left to right.
    const rows = useMemo<ChartRow[]>(() => [...years].reverse(), [years]);
    const hasStockDividend = rows.some((row) => row.stockDividend > 0);

    return (
        <Card>
            <CardContent>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, mb: 2 }}>
                    <Box>
                        <Typography variant="h6" component="h2">{view === 'amount' ? '歷年股利' : '歷年殖利率'}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {view === 'amount' ? '每股配發金額（元），同一年多次配息合併計算' : '當年各次除權息的殖利率加總（%）'}
                        </Typography>
                    </Box>
                    <ToggleButtonGroup
                        size="small"
                        exclusive
                        value={view}
                        onChange={(_event, value: ChartView | null) => value && setView(value)}
                        aria-label="圖表內容"
                    >
                        <ToggleButton value="amount">股利金額</ToggleButton>
                        <ToggleButton value="yield">殖利率</ToggleButton>
                    </ToggleButtonGroup>
                </Stack>
                <Box sx={{ height: CHART_HEIGHT, ml: -2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        {view === 'amount' ? (
                            <BarChart data={rows} barCategoryGap="20%">
                                <CartesianGrid vertical={false} stroke={GRID} />
                                <XAxis dataKey="year" {...axisProps} />
                                <YAxis {...axisProps} axisLine={false} width={48} />
                                <Tooltip cursor={{ fill: GRID, opacity: 0.4 }} content={<ChartTooltip format={(value) => `${formatAmount(value)} 元`} />} />
                                <Legend iconType="square" wrapperStyle={{ fontSize: AXIS_FONT_SIZE }} formatter={legendText} />
                                <Bar
                                    dataKey="cashDividend"
                                    name="現金股利"
                                    stackId="dividend"
                                    fill={SERIES_1}
                                    stroke={SURFACE}
                                    strokeWidth={2}
                                    radius={BAR_RADIUS}
                                />
                                {hasStockDividend && (
                                    <Bar dataKey="stockDividend" name="股票股利" stackId="dividend" fill={SERIES_2} stroke={SURFACE} strokeWidth={2} radius={BAR_RADIUS} />
                                )}
                            </BarChart>
                        ) : (
                            <LineChart data={rows}>
                                <CartesianGrid vertical={false} stroke={GRID} />
                                <XAxis dataKey="year" {...axisProps} />
                                <YAxis {...axisProps} axisLine={false} width={48} unit="%" />
                                <Tooltip cursor={{ stroke: AXIS_TEXT, strokeDasharray: '4 4' }} content={<ChartTooltip format={(value) => formatPercent(value)} />} />
                                <Legend iconType="plainline" wrapperStyle={{ fontSize: AXIS_FONT_SIZE }} formatter={legendText} />
                                <Line
                                    type="monotone"
                                    dataKey="cashYieldRatio"
                                    name="現金殖利率"
                                    stroke={SERIES_1}
                                    strokeWidth={2}
                                    dot={{ r: 3, fill: SERIES_1, stroke: SURFACE, strokeWidth: 2 }}
                                    activeDot={{ r: 5, stroke: SURFACE, strokeWidth: 2 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="retroactiveYieldRatio"
                                    name="還原殖利率"
                                    stroke={SERIES_2}
                                    strokeWidth={2}
                                    dot={{ r: 3, fill: SERIES_2, stroke: SURFACE, strokeWidth: 2 }}
                                    activeDot={{ r: 5, stroke: SURFACE, strokeWidth: 2 }}
                                />
                            </LineChart>
                        )}
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
    );
}
