import SearchIcon from '@mui/icons-material/Search';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { StockOption } from '../../../api/types';
import { useStockList } from '../hooks/use-stock-queries';
import { filterStockOptions, optionLabel, pickKeyword, resolveKeyword, stockPath } from '../search';

interface StockSearchProps {
    size?: 'small' | 'medium';
    autoFocus?: boolean;
}

export const SEARCH_LABEL = '輸入股票代號或名稱，例如 2330、0056、中華電';
const COMPACT_SEARCH_LABEL = '搜尋代號或名稱';

export default function StockSearch({ size = 'medium', autoFocus = false }: StockSearchProps) {
    const navigate = useNavigate();
    const { data, isLoading } = useStockList();
    const options = data?.list ?? [];
    const [inputValue, setInputValue] = useState('');
    const isLarge = size === 'medium';

    const goTo = (keyword: string) => {
        if(keyword === '') return;
        setInputValue('');
        navigate(stockPath(keyword));
    };

    const handleChange = (value: string | StockOption | null) => {
        if(value === null) return;
        goTo(typeof value === 'string' ? resolveKeyword(options, value) : value.idString);
    };

    return (
        <Autocomplete<StockOption, false, false, true>
            freeSolo
            options={options}
            value={null}
            inputValue={inputValue}
            onInputChange={(_event, value, reason) => {
                if(reason !== 'reset') setInputValue(value);
            }}
            onChange={(_event, value) => handleChange(value)}
            filterOptions={(list, state) => filterStockOptions(list, state.inputValue)}
            getOptionLabel={(option) => (typeof option === 'string' ? option : optionLabel(option))}
            loading={isLoading}
            loadingText="載入股票清單中…"
            noOptionsText="找不到符合的股票，按 Enter 直接查詢"
            autoHighlight
            selectOnFocus
            handleHomeEndKeys
            size={size}
            renderOption={({ key, ...props }, option) => (
                <Box component="li" key={key} {...props} sx={{ display: 'flex', gap: 1.5 }}>
                    <Typography component="span" sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums', minWidth: '4.5em' }}>
                        {option.idString}
                    </Typography>
                    <Typography component="span" color="text.secondary">{option.name}</Typography>
                </Box>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder={isLarge ? SEARCH_LABEL : COMPACT_SEARCH_LABEL}
                    autoFocus={autoFocus}
                    slotProps={{
                        ...params.slotProps,
                        htmlInput: {
                            ...params.slotProps.htmlInput,
                            'aria-label': '搜尋股票',
                            enterKeyHint: 'search',
                        },
                        input: {
                            ...params.slotProps.input,
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                            endAdornment: isLarge ? (
                                <InputAdornment position="end">
                                    <Button
                                        variant="contained"
                                        disableElevation
                                        onClick={() => goTo(pickKeyword(options, inputValue))}
                                        sx={{ borderRadius: 999, px: 3, mr: -0.5 }}
                                    >
                                        查詢
                                    </Button>
                                </InputAdornment>
                            ) : params.slotProps.input.endAdornment,
                            sx: isLarge ? { borderRadius: 999, pl: 2, py: 0.75, fontSize: '1.05rem', backgroundColor: 'background.paper' } : { borderRadius: 999 },
                        },
                    }}
                />
            )}
        />
    );
}
