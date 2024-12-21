import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/router';

const Cart = () => {
    const router = useRouter();
    const { cart } = useCart();
    const [carts, setCarts] = useState<any[]>([]);

    const removeFromCart = (productId: number) => {
        const updatedCart = cart.filter((item) => item.id !== productId);
        setCarts(updatedCart);

        localStorage.setItem('cart', JSON.stringify(updatedCart));
        window.location.reload()
    };


    return (
        <>
            <Box p={2} sx={{ maxWidth: '1200px', margin: 'auto' }}>
            <Box sx={{textAlign:'right'}}>
                <Button sx={{ background: 'gray', color: 'white', fontWeight: 600, fontSize: '16px' }} onClick={() => router.push('/')}>بازگشت به خانه</Button>
                </Box>
                <Typography textAlign={'center'} variant="h4" gutterBottom>
                    سبد خرید
                </Typography>
                {cart.length === 0 ? (
                    <Typography sx={{direction: 'rtl'}} fontSize={'24px'} textAlign={'center'} color="text.secondary">
                        سبد خرید شما خالی است.
                    </Typography>
                ) : (
                    <Grid container spacing={3}>
                        {cart.map((product: any, index: number) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        image={product.image}
                                        alt={product.title}
                                        sx={{ height: 200, objectFit: 'contain' }}
                                    />
                                    <CardContent>
                                        <Typography variant="h6">{product.title}</Typography>
                                        <Typography color="text.secondary">${product.price}</Typography>
                                    </CardContent>
                                    <Box p={1}>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => removeFromCart(product.id)}
                                        >
                                            حذف از سبد خرید
                                        </Button>
                                    </Box>

                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </>
    );
};

export default Cart;
