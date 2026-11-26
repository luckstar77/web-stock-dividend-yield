import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router';
import { StockOption } from '../../../api/types';
import { stockPath } from '../search';

interface StockChipsProps {
    title: string;
    stocks: readonly StockOption[];
    action?: ReactNode;
}

export default function StockChips({ title, stocks, action }: StockChipsProps) {
    if(stocks.length === 0) return null;
    return (
        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 0.5 }}>{title}</Typography>
            {stocks.map((stock) => (
                <Chip
                    key={stock.idString}
                    component={RouterLink}
                    to={stockPath(stock.idString)}
                    clickable
                    variant="outlined"
                    label={`${stock.idString} ${stock.name}`}
                />
            ))}
            {action}
        </Stack>
    );
}
