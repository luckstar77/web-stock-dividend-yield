import LinearProgress from '@mui/material/LinearProgress';
import { RouteObject } from 'react-router';
import Layout from '../components/layout/Layout';
import HomePage from '../pages/HomePage';
import NotFoundPage from '../pages/NotFoundPage';

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <Layout />,
        // Shown while a lazy page loads on the first visit.
        hydrateFallbackElement: <LinearProgress aria-label="載入中" />,
        children: [
            { index: true, element: <HomePage /> },
            {
                path: 'stock/:stockId',
                // The chart library is only needed on this page, so it loads with it.
                lazy: async () => ({ Component: (await import('../pages/StockPage')).default }),
            },
            { path: '*', element: <NotFoundPage /> },
        ],
    },
];
