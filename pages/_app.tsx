import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from 'react-query';
import React from 'react';
import { CartProvider } from '@/context/CartContext';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const theme = createTheme();
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: any) {
    return (
        <>
            <ToastContainer rtl />
            <CartProvider>
                <QueryClientProvider client={queryClient}>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <Component {...pageProps} />
                    </ThemeProvider>
                </QueryClientProvider>
            </CartProvider>
        </>
    );
}

export default MyApp;

