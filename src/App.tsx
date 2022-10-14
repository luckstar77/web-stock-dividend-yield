import React from 'react';
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

const STOCK_API_URL = 'http://localhost:3000/stock';

function App() {
    const [allAvgCashYields, setAllAvgCashYields] = React.useState();
    const [allAvgRetroactiveYields, setAllAvgRetroactiveYields] = React.useState();
    const [amountOfDividend, setAmountOfDividend] = React.useState();
    const [amountOfSuccess, setAmountOfSuccess] = React.useState();
    const [dividendYearEnd, setDividendYearEnd] = React.useState('');
    const [dividendYearStart, setDividendYearStart] = React.useState('');
    const [successRate, setSuccessRate] = React.useState();
    const [search, setSearch] = React.useState('');

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


    return (
        <div>
            <TextField 
                id="outlined-basic" 
                label="請輸入股票代號或名稱" 
                variant="outlined" 
                value={search}
                onChange={handleSearchChange}
            />
            <Button variant="contained" onClick={() => {
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
                        successRate} = data;
                    setAllAvgCashYields(allAvgCashYields.toFixed(2));
                    setAllAvgRetroactiveYields(allAvgRetroactiveYields.toFixed(2));
                    setAmountOfDividend(amountOfDividend);
                    setAmountOfSuccess(amountOfSuccess);
                    setDividendYearEnd(dividendYearEnd);
                    setDividendYearStart(dividendYearStart);
                    setSuccessRate(successRate.toFixed(2));
                }).catch((error) => {
                    setOpen(true);
                    setErrorMessage(error);
                });
            }}>確定</Button>
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    填權息成功率: {successRate}%
                    </Typography>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    除權息次數: {amountOfDividend}
                    </Typography>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    填權息次數: {amountOfSuccess}
                    </Typography>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    統計年分: {dividendYearStart} - {dividendYearEnd}
                    </Typography>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    歷年平均現金殖利率: {allAvgCashYields}%
                    </Typography>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    歷年平均還原殖利率: {allAvgRetroactiveYields}%
                    </Typography>
                </CardContent>
            </Card>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {errorMessage.toString()}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default App;
