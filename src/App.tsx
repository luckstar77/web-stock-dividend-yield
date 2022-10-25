import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import StockLogo from './stock_icon.png';

const STOCK_API_URL = 'http://localhost:3000/stock';
const STOCK_LIST_API_URL = 'http://localhost:3000/stocks';

function App() {
    const [allAvgCashYields, setAllAvgCashYields] = React.useState();
    const [allAvgRetroactiveYields, setAllAvgRetroactiveYields] = React.useState();
    const [amountOfDividend, setAmountOfDividend] = React.useState();
    const [amountOfSuccess, setAmountOfSuccess] = React.useState();
    const [dividendYearEnd, setDividendYearEnd] = React.useState('');
    const [dividendYearStart, setDividendYearStart] = React.useState('');
    const [id, setId] = React.useState('');
    const [name, setName] = React.useState('');
    const [successRate, setSuccessRate] = React.useState();
    const [search, setSearch] = React.useState('');
    const [stocks, setStocks] = React.useState([]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    const [open, setOpen] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const handleClick = () => {
        setOpen(true);
    };
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    useEffect(() => {
        axios.get(STOCK_LIST_API_URL).then(({data}) => {
            setStocks(data);
        }).catch((error) => {
            setOpen(true);
            setErrorMessage(error);
        });
    }, []); 

    return (
        <div>
            
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {errorMessage.toString()}
                </Alert>
            </Snackbar>
            <Grid container 
                direction="row"
                justifyContent="center"
                alignItems="center"
                style={{ minHeight: '100vh' }}
            >
                <Box minWidth={275}>
                    <Grid container 
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <img src={StockLogo} style={{width:'100px'}} />
                    </Grid>
                    <Grid container 
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Typography variant="h4" style={{
                            fontFamily: '"Noto Sans TC", "Roboto","Helvetica","Arial",sans-serif',
                            fontSize: '2.05rem'
                        }} gutterBottom>
                        權息通
                        </Typography>
                    </Grid>
                    <Typography variant="h6" style={{fontFamily: '"Noto Sans TC", "Roboto","Helvetica","Arial",sans-serif'}} gutterBottom>
                        輕鬆查詢各股票歷年除權息資料
                    </Typography>
                    <Box style={{marginTop:'16px'}}>
                        <Autocomplete
                            id="combo-box-demo"
                            options={stocks}
                            disableClearable
                            forcePopupIcon={false}
                            renderInput={params => {
                                return (
                                    <TextField
                                        {...params}
                                        label="請輸入股票代號或名稱"
                                        variant="outlined"
                                        fullWidth
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton type="button" aria-label="search"
                                                        onClick={() => {
                                                            const value = params.inputProps.value  as string;
                                                            const [search, ...rest] = value.split(' ');
                                                            axios.get(STOCK_API_URL,{
                                                                params: {
                                                                    search
                                                                }
                                                            }).then(({data}) => {
                                                                const {allAvgCashYields,
                                                                    allAvgRetroactiveYields,
                                                                    amountOfDividend,
                                                                    amountOfSuccess,
                                                                    dividendYearEnd,
                                                                    dividendYearStart,
                                                                    successRate,
                                                                    id,
                                                                    name} = data;
                                                                setAllAvgCashYields(allAvgCashYields.toFixed(2));
                                                                setAllAvgRetroactiveYields(allAvgRetroactiveYields.toFixed(2));
                                                                setAmountOfDividend(amountOfDividend);
                                                                setAmountOfSuccess(amountOfSuccess);
                                                                setDividendYearEnd(dividendYearEnd);
                                                                setDividendYearStart(dividendYearStart);
                                                                setSuccessRate(successRate.toFixed(2));
                                                                setId(id);
                                                                setName(name);
                                                            }).catch((error) => {
                                                                setOpen(true);
                                                                setErrorMessage(error);
                                                            });
                                                        }}
                                                    >
                                                        <SearchIcon />
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                );
                            }}
                        />
                    </Box>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1" gutterBottom>
                    代號: {id}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                    名稱: {name}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                    填權息成功率: {successRate}%
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                    除權息次數: {amountOfDividend}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                    填權息次數: {amountOfSuccess}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                    統計年分: {dividendYearStart} - {dividendYearEnd}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                    歷年平均現金殖利率: {allAvgCashYields}%
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                    歷年平均還原殖利率: {allAvgRetroactiveYields}%
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Grid>
        </div>
    );
}

export default App;
