import express from 'express';
import { __dirname } from './utils.js';
import { errorHandler } from './middlewares/errorHandler.js';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import viewsRouter from './routes/views.router.js';
import cartRouter from './routes/api/cart.router.js';
import productsRouter from './routes/api/products.router.js';

import ProductsManager from './managers/product.manager.js';
import CartManager from './managers/cart.manager.js';
import MessageManager from './managers/messages.manager.js';

const app = express();

// Inicializa ProductManager, CartManager y MessageManager
const productManager = new ProductsManager(`${__dirname}/db/products.json`);
const cartManager = new CartManager(`${__dirname}/db/messages.json`);
const messageManager = new MessageManager(`${__dirname}/db/messages.json`);

// Configurar middleware para parsear datos de formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views`);

app.use('/', viewsRouter);
app.use('/chat', viewsRouter);
app.use('/realTimeProducts', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('/vista1', viewsRouter);
app.use('/vista2', viewsRouter);
app.use('/websocket', viewsRouter);
app.use(errorHandler);

const httpServer = app.listen(8080, () => {
  console.log('🚀 Server listening on port 8080');
});

const socketServer = new Server(httpServer);

socketServer.on('connection', async (socket) => {
  console.log('🟢 ¡New connection!', socket.id);

  // Emitir productos actuales a los clientes
  socketServer.emit('products', await productManager.getProducts());

  socket.on('disconnect', () => {
    console.log('🔴 User disconnect', socket.id);
  });

  socket.on('newUser', (user) => {
    console.log(`> ${user} ha iniciado sesión`);
    socket.broadcast.emit('newUser', user);
  });

  // socket.on('addProductToCart', async (productId) => {
  //   const product = await productManager.getProductById(productId);
  //   if (product) {
  //     // Aquí  añadir lógica para agregar el producto a un carrito
  //     socket.emit('productAdded', product);
  //   } else {
  //     socket.emit('error', 'Product not found');
  //   }
  // });

  socket.on('addProductToCart', async ({ cartId, productId }) => {
    try {
      const updatedCart = await cartManager.saveProductToCart(cartId, productId);
      socket.emit('productAdded', updatedCart);
    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  socket.on('removeProductFromCart', async (productId) => {
    // Lógica para eliminar el producto del carrito
    socket.emit('productRemoved', productId);
  });

  socket.on('chat:message', async (msg) => {
    await messageManager.createMsg(msg);
    socketServer.emit('messages', await messageManager.getAll());
  });

  socket.on('chat:typing', (username) => {
    socket.broadcast.emit('chat:typing', username);
  });
});


app.get('/products', async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});




app.post('/cart', async (req, res) => {
  const { cartId, productId } = req.body;
  try {
    const updatedCart = await cartManager.saveProductToCart(cartId, productId);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//para borrar un producto

app.delete('/cart/:productId', async (req, res) => {
  const { productId } = req.params;
  // Lógica para eliminar el producto del carrito
  res.status(200).json({ message: 'Product removed from cart', productId });
});

app.post("/products/add", async (req, res) => {
  try {
    const { title, description, code, price, stock, category } = req.body;
    const newProduct = await productManager.createProduct({ title, description, code, price, stock, category });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error al agregar el producto:", error);
    res.status(500).send("Error al agregar el producto");
  }
});
