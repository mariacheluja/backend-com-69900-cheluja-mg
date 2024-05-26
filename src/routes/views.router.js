
import { Router } from "express";

const router = Router();

router.get('/', (req, res) => {
    res.render('chat');
});

router.get('/vista1', (req, res) => {
    res.render('vista1');
});

router.get('/vista2', (req, res) => {
    res.render('vista2', { layout: 'realTimeProducts.handlebars' });
});

router.get('/Home', (req, res) => {
    res.render('Home');
});

router.get('/realTimeProducts', (req, res) => {
    res.render('realtimeproducts');
});

// Ruta para obtener productos en tiempo real
router.get('/realTimeProducts', async (req, res) => {
    try {
        const products = await productsManager.getProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error al obtener productos');
    }
});

export default router;


