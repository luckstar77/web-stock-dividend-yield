import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import AppProviders from './app/AppProviders';
import { routes } from './app/routes';

const router = createBrowserRouter(routes);
const container = document.getElementById('root');
if(!container) throw new Error('#root not found in index.html');

createRoot(container).render(
    <StrictMode>
        <AppProviders>
            <RouterProvider router={router} />
        </AppProviders>
    </StrictMode>,
);
