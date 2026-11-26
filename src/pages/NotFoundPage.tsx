import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router';
import { useDocumentTitle } from '../utils/use-document-title';

export default function NotFoundPage() {
    useDocumentTitle('找不到頁面');
    return (
        <Container maxWidth="sm" sx={{ py: 10 }}>
            <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center' }}>
                <Typography variant="h4" component="h1">找不到這個頁面</Typography>
                <Typography color="text.secondary">網址可能打錯了，或是頁面已經移除。</Typography>
                <Button variant="contained" component={RouterLink} to="/">回首頁查詢股票</Button>
            </Stack>
        </Container>
    );
}
