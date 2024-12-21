import React, { useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import axios from 'axios';
import {
    Box,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    CircularProgress,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

type Product = {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
};

type ProductsResponse = {
    products: Product[];
    nextPage: number | null;
};

const fetchProducts = async ({ pageParam = 1 }): Promise<ProductsResponse> => {
    const response = await axios.get(`https://fakestoreapi.com/products?_page=${pageParam}&_limit=10`);
    return {
        products: response.data,
        nextPage: response.data.length ? pageParam + 1 : null,
    };
};

const ProductCards: React.FC = () => {
    const router = useRouter();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery('products', fetchProducts, {
        getNextPageParam: (lastPage) => lastPage.nextPage,
    });

    const { addToCart } = useCart();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const filteredProducts = data?.pages
        .flatMap((page) => page.products)
        .filter((product) => product.title.toLowerCase().includes(searchQuery)) || [];

    const handleAddToCartClick = (product: Product): void => {
        setSelectedProduct(product);
        setIsDialogOpen(true);
    };

    const handleConfirmAddToCart = (): void => {
        if (selectedProduct) {
            addToCart(selectedProduct);
            toast.success(`${selectedProduct.title} به سبد خرید اضافه شد!`, {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setSelectedProduct(null);
            setIsDialogOpen(false);
        }
    };

    const handleDialogClose = (): void => {
        setSelectedProduct(null);
        setIsDialogOpen(false);
    };

    const handleLoadMore = (): void => {
        if (hasNextPage) fetchNextPage();
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (isError) {
        return <Typography color="error" align="center">خطا در دریافت اطلاعات</Typography>;
    }

    return (
        <Box p={2} sx={{ maxWidth: '1560px', margin: 'auto' }}>

            <Box mb={2}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Search"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search the product name"
                />
            </Box>
            <Box sx={{textAlign:'right'}}>
                <Button sx={{ background: 'gray', color: 'white', fontWeight: 600, fontSize: '17px', mb: 2 }} onClick={() => router.push('/cart')}>مشاهد سبد خرید</Button>
            </Box>
            <Grid container spacing={3}>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <CardMedia
                                    component="img"
                                    image={product.image}
                                    alt={product.title}
                                    sx={{ height: 200, objectFit: 'contain', p: 2, backgroundColor: '#f5f5f5' }}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                                        {product.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {product.description.slice(0, 100)}...
                                    </Typography>
                                    <Typography variant="h6" color="primary" textAlign={'right'} sx={{ mb: 2 }}>
                                        ${product.price}
                                    </Typography>
                                </CardContent>
                                <Box p={2}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        onClick={() => handleAddToCartClick(product)}
                                    >
                                        انتخاب گزینه‌ها
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography align="center" color="text.secondary" sx={{ mt: 3, width: '100%', fontWeight: 600, fontSize: "22px" }}>
                        هیچ محصولی پیدا نشد
                    </Typography>
                )}
            </Grid>

            {isFetchingNextPage && (
                <Box display="flex" justifyContent="center" alignItems="center" mt={3}>
                    <CircularProgress />
                </Box>
            )}

            {filteredProducts.length > 0 && (
                <>
                    {hasNextPage && (
                        <Box display="flex" justifyContent="center" mt={3}>
                            <Button variant="contained" onClick={handleLoadMore} disabled={isFetchingNextPage}>
                                بارگذاری بیشتر
                            </Button>
                        </Box>
                    )}

                </>
            )}
            <Dialog open={isDialogOpen} onClose={handleDialogClose}>
                <DialogTitle>تأیید اضافه شدن به سبد خرید</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        آیا از اضافه کردن محصول <strong>{selectedProduct?.title}</strong> به سبد خرید مطمئن هستید؟
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="secondary">
                        لغو
                    </Button>
                    <Button onClick={handleConfirmAddToCart} color="primary">
                        تأیید
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProductCards;
