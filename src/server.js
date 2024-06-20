import express from "express";
import handlebars from "express-handlebars";
import { __dirname } from "./utils.js";
import { Server } from 'socket.io';
import morgan from 'morgan';
import { errorHandler } from "./middlewares/errorHandler.js";
import { initMongoDB } from "./db/database.js";

import ProductsManager from './managers/product.manager.js';
import CartManager from './managers/cart.manager.js';
import MessageManager from './managers/messages.manager.js';

import viewsRouter from './routes/views.router.js';
import productsRouter from '../src/routes/api/products.router.js';
import userRouter from './routes/users.router.js';
import cartRouter from './routes/api/cart.router.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(morgan('dev'));

// Set up Handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

// Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);
app.use("/chat", viewsRouter);
app.use("/realTimeProducts", viewsRouter);
app.use("/users", userRouter);
app.use("/vista1", viewsRouter);
app.use("/vista2", viewsRouter);
app.use("/websocket", viewsRouter);
app.use("/products", productsRouter);

// Error handler middleware
app.use(errorHandler);

// Database initialization
initMongoDB();

const httpServer = app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});

const socketServer = new Server(httpServer);

const productManager = new ProductsManager(`${__dirname}/db/products.json`);
const cartManager = new CartManager(`${__dirname}/db/carts.json`);
const messageManager = new MessageManager(`${__dirname}/db/messages.json`);

socketServer.on('connection', async (socket) => {
  console.log('🟢 ¡New connection!', socket.id);

  // Emit current products to clients
  socketServer.emit('products', await productManager.getProducts());

  socket.on('disconnect', () => {
    console.log('🔴 User disconnect', socket.id);
  });

  socket.on('newUser', (user) => {
    console.log(`> ${user} ha iniciado sesión`);
    socket.broadcast.emit('newUser', user);
  });

  socket.on('addProductToCart', async ({ cartId, productId }) => {
    try {
      const updatedCart = await cartManager.saveProductToCart(cartId, productId);
      socket.emit('productAdded', updatedCart);
    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  socket.on('removeProductFromCart', async (productId) => {
    // Logic to remove the product from the cart
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

// Additional routes
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

app.post('/products/add', async (req, res) => {
  try {
    const { title, description, code, price, stock, category } = req.body;
    const newProduct = await productManager.createProduct({ title, description, code, price, stock, category });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error adding the product:", error);
    res.status(500).send("Error adding the product");
  }
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













// import express from "express";
// import handlebars from "express-handlebars";
// import { __dirname } from "./utils.js";
// import { Server } from 'socket.io';
// import morgan from 'morgan';
// import { errorHandler } from "./middlewares/errorHandler.js";

// import { initMongoDB } from "./db/database.js";

// import ProductsManager from './managers/product.manager.js';
// import CartManager from './managers/cart.manager.js';
// import MessageManager from './managers/messages.manager.js';

// // import { fileURLToPath } from 'url';
// // import path from 'path';

// // const __dirname = path.dirname(fileURLToPath(import.meta.url));




// import viewsRouter from './routes/views.router.js';
// import productsRouter from '../src/routes/api/products.router.js';
// import userRouter from './routes/users.router.js';
// import cartRouter from './routes/api/cart.router.js';

// const app = express();

// const PORT = process.env.PORT || 8080;


// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// // app.use(morgan('dev'));
// app.use("/products", productsRouter);
// app.use(errorHandler);
// app.use('/', viewsRouter);
// app.use('/chat', viewsRouter);
// app.use('/realTimeProducts', viewsRouter);
// app.use('/api/products', productsRouter);
// app.use('/api/carts', cartRouter);
// app.use('/vista1', viewsRouter);
// app.use('/vista2', viewsRouter);
// app.use('/websocket', viewsRouter);
// app.use('/users', userRouter);
// app.use('/products', productsRouter);
// app.use('/api/carts', cartRouter);
// app.use('/realTimeProducts', viewsRouter);
// // Manejo de errores
// app.use(errorHandler);



// app.use(express.json());
// app.use(express.static(__dirname + "/public"));

// app.engine("handlebars", handlebars.engine());
// app.set("view engine", "handlebars");
// app.set("views", __dirname + "/views");

// app.get('/', (req, res)=>{
//   res.render('websocket')
// })
// initMongoDB()
// const httpServer = app.listen(8080, () => {
//   console.log("Escuchando al puerto 8080");
// });

// const socketServer = new Server(httpServer);

// const products = [];

// socketServer.on('connection', (socket)=>{
//   console.log(`Usuario conectado: ${socket.id}`);

//   socket.on('disconnect', ()=>{
//     console.log('Usuario desconectado');
//   })

//   socket.emit('saludoDesdeBack', 'Bienvenido a websockets')

//   socket.on('respuestaDesdeFront', (message)=>{
//     console.log(message);
//   })

//   socket.on('newProduct', (product)=>{
//     products.push(product);
//     socketServer.emit('products', products);
//   })

//   app.post('/', (req,res)=>{
//     const { message } = req.body;
//     socketServer.emit('message', message);
//     res.send('se envió mensaje al socket del cliente')
//   })

// })



// app.get('/products', async (req, res) => {
//   const products = await productManager.getProducts();
//   res.json(products);
// });

// app.post('/cart', async (req, res) => {
//   const { cartId, productId } = req.body;
//   try {
//     const updatedCart = await cartManager.saveProductToCart(cartId, productId);
//     res.status(200).json(updatedCart);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// app.post('/products/add', async (req, res) => {
//   try {
//     const { title, description, code, price, stock, category } = req.body;
//     const newProduct = await productManager.createProduct({ title, description, code, price, stock, category });
//     res.status(201).json(newProduct);
//   } catch (error) {
//     console.error("Error al agregar el producto:", error);
//     res.status(500).send("Error al agregar el producto");
//   }
// });






// // import express from "express";
// // import productsRouter from '../src/routes/api/products.router.js';
// // import { errorHandler } from "./middlewares/errorHandler.js";
// // import { initMongoDB } from "./db/database.js";


// // import { __dirname } from './utils.js';

// // import handlebars from 'express-handlebars';
// // import { Server } from 'socket.io';
// // import viewsRouter from './routes/views.router.js';

// // //import productsRouter from '../src/routes/api/products.router.js';
// // import ProductsManager from './managers/product.manager.js';
// // import CartManager from './managers/cart.manager.js';

// // import MessageManager from './managers/messages.manager.js';
// // import morgan from 'morgan';
// // import userRouter from './routes/users.router.js';
// // import cartRouter from './routes/api/cart.router.js';
// // //import productRouter from './routes/api/products.router.js';

// // const productManager = new ProductsManager(`${__dirname}/db/products.json`);
// // const cartManager = new CartManager(`${__dirname}/db/carts.json`);
// // const messageManager = new MessageManager(`${__dirname}/db/messages.json`);



// // const app = express();

// // app.use(express.json());
// // app.use(express.urlencoded({ extended: true }));
// // app.use("/products", productsRouter);
// // app.use(errorHandler);
// // app.use('/', viewsRouter);
// // app.use('/chat', viewsRouter);
// // app.use('/realTimeProducts', viewsRouter);
// // app.use('/api/products', productsRouter);
// // app.use('/api/carts', cartRouter);
// // app.use('/vista1', viewsRouter);
// // app.use('/vista2', viewsRouter);
// // app.use('/websocket', viewsRouter);
// // app.use('/users', userRouter);
// // app.use('/products', productsRouter);
// // app.use('/carts', cartRouter);

// // // Manejo de errores
// // app.use(errorHandler);
// // initMongoDB()

// // const PORT = 8080;

// // app.listen(PORT, () => console.log(`SERVER UP ON PORT ${PORT}`));

// // const httpServer = app.listen(PORT, () => {
// //   console.log(`🚀 Server listening on port ${PORT}`);
// // });

// // // Configura el servidor de Socket.io
// // const socketServer = new Server(httpServer);

// // socketServer.on('connection', async (socket) => {
// //   console.log('🟢 ¡New connection!', socket.id);

// //   // Emitir productos actuales a los clientes
// //   socketServer.emit('products', await productManager.getProducts());

// //   socket.on('disconnect', () => {
// //     console.log('🔴 User disconnect', socket.id);
// //   });

// //   socket.on('newUser', (user) => {
// //     console.log(`> ${user} ha iniciado sesión`);
// //     socket.broadcast.emit('newUser', user);
// //   });

// //   socket.on('addProductToCart', async ({ cartId, productId }) => {
// //     try {
// //       const updatedCart = await cartManager.saveProductToCart(cartId, productId);
// //       socket.emit('productAdded', updatedCart);
// //     } catch (error) {
// //       socket.emit('error', error.message);
// //     }
// //   });

// //   socket.on('removeProductFromCart', async (productId) => {
// //     // Lógica para eliminar el producto del carrito
// //     socket.emit('productRemoved', productId);
// //   });

// //   socket.on('chat:message', async (msg) => {
// //     await messageManager.createMsg(msg);
// //     socketServer.emit('messages', await messageManager.getAll());
// //   });

// //   socket.on('chat:typing', (username) => {
// //     socket.broadcast.emit('chat:typing', username);
// //   });
// // });

// // // Define rutas adicionales
// // app.get('/products', async (req, res) => {
// //   const products = await productManager.getProducts();
// //   res.json(products);
// // });

// // app.post('/cart', async (req, res) => {
// //   const { cartId, productId } = req.body;
// //   try {
// //     const updatedCart = await cartManager.saveProductToCart(cartId, productId);
// //     res.status(200).json(updatedCart);
// //   } catch (error) {
// //     res.status(500).json({ message: error.message });
// //   }
// // });

// // app.post('/products/add', async (req, res) => {
// //   try {
// //     const { title, description, code, price, stock, category } = req.body;
// //     const newProduct = await productManager.createProduct({ title, description, code, price, stock, category });
// //     res.status(201).json(newProduct);
// //   } catch (error) {
// //     console.error("Error al agregar el producto:", error);
// //     res.status(500).send("Error al agregar el producto");
// //   }
// // });

























// // import express from 'express';
// // import { __dirname } from './utils.js';
// // import { errorHandler } from './middlewares/errorHandler.js';
// // import handlebars from 'express-handlebars';
// // import { Server } from 'socket.io';
// // import viewsRouter from './routes/views.router.js';

// // import productsRouter from '../src/routes/api/products.router.js';
// // import ProductsManager from './managers/product.manager.js';
// // import CartManager from './managers/cart.manager.js';

// // import MessageManager from './managers/messages.manager.js';
// // import morgan from 'morgan';
// // import userRouter from './routes/users.router.js';
// // import cartRouter from './routes/api/cart.router.js';
// // import productRouter from './routes/api/products.router.js';
// // // server del profe

// // //import express from 'express';
// // //import morgan from 'morgan';
// // //import usersRouter from './routes/users.router.js';
// // //import petsRouter from './routes/pets.router.js';
// // //import { errorHandler } from './middlewares/errorHandler.js';
// // import { initMongoDB } from './daos/mongodb/connection.js';
// // import 'dotenv/config'

// // const app = express();


// // //app.use es propio de express
// // app.use(express.json());
// // app.use(express.urlencoded({extended: true}));
// // app.use(morgan('dev'));

// // app.use('/user', userRouter);
// // //app.use('/pets', petsRouter);

// // app.use(errorHandler);

// // if(process.env.PERSISTENCE === 'MONGO') initMongoDB();

// // const PORT = process.env.PORT || 8080;

// // app.listen(PORT, () => console.log(`SERVER UP ON PORT ${PORT}`));



// // //import { initMongoDB } from '../src/conexion.js';

// // // Inicializa la conexión a MongoDB
// // initMongoDB();



// // // Configura middlewares
// // app.use(express.json());
// // app.use(express.urlencoded({ extended: true }));
// // app.use(morgan('dev'));
// // app.use(express.static(__dirname + '/public'));

// // // Configura motor de plantillas
// // app.engine('handlebars', handlebars.engine());
// // app.set('view engine', 'handlebars');
// // app.set('views', `${__dirname}/views`);

// // // Inicializa ProductManager, CartManager y MessageManager
// // const productManager = new ProductsManager(`${__dirname}/db/products.json`);
// // const cartManager = new CartManager(`${__dirname}/db/carts.json`);
// // const messageManager = new MessageManager(`${__dirname}/db/messages.json`);

// // // Configura rutas
// // app.use('/', viewsRouter);
// // app.use('/chat', viewsRouter);
// // app.use('/realTimeProducts', viewsRouter);
// // app.use('/api/products', productsRouter);
// // app.use('/api/carts', cartRouter);
// // app.use('/vista1', viewsRouter);
// // app.use('/vista2', viewsRouter);
// // app.use('/websocket', viewsRouter);
// // app.use('/users', userRouter);
// // app.use('/products', productsRouter);
// // app.use('/carts', cartRouter);

// // // Manejo de errores
// // app.use(errorHandler);

// // // Inicia el servidor HTTP
// // const httpServer = app.listen(PORT, () => {
// //   console.log(`🚀 Server listening on port ${PORT}`);
// // });

// // // Configura el servidor de Socket.io
// // const socketServer = new Server(httpServer);

// // socketServer.on('connection', async (socket) => {
// //   console.log('🟢 ¡New connection!', socket.id);

// //   // Emitir productos actuales a los clientes
// //   socketServer.emit('products', await productManager.getProducts());

// //   socket.on('disconnect', () => {
// //     console.log('🔴 User disconnect', socket.id);
// //   });

// //   socket.on('newUser', (user) => {
// //     console.log(`> ${user} ha iniciado sesión`);
// //     socket.broadcast.emit('newUser', user);
// //   });

// //   socket.on('addProductToCart', async ({ cartId, productId }) => {
// //     try {
// //       const updatedCart = await cartManager.saveProductToCart(cartId, productId);
// //       socket.emit('productAdded', updatedCart);
// //     } catch (error) {
// //       socket.emit('error', error.message);
// //     }
// //   });

// //   socket.on('removeProductFromCart', async (productId) => {
// //     // Lógica para eliminar el producto del carrito
// //     socket.emit('productRemoved', productId);
// //   });

// //   socket.on('chat:message', async (msg) => {
// //     await messageManager.createMsg(msg);
// //     socketServer.emit('messages', await messageManager.getAll());
// //   });

// //   socket.on('chat:typing', (username) => {
// //     socket.broadcast.emit('chat:typing', username);
// //   });
// // });

// // // Define rutas adicionales
// // app.get('/products', async (req, res) => {
// //   const products = await productManager.getProducts();
// //   res.json(products);
// // });

// // app.post('/cart', async (req, res) => {
// //   const { cartId, productId } = req.body;
// //   try {
// //     const updatedCart = await cartManager.saveProductToCart(cartId, productId);
// //     res.status(200).json(updatedCart);
// //   } catch (error) {
// //     res.status(500).json({ message: error.message });
// //   }
// // });

// // app.post('/products/add', async (req, res) => {
// //   try {
// //     const { title, description, code, price, stock, category } = req.body;
// //     const newProduct = await productManager.createProduct({ title, description, code, price, stock, category });
// //     res.status(201).json(newProduct);
// //   } catch (error) {
// //     console.error("Error al agregar el producto:", error);
// //     res.status(500).send("Error al agregar el producto");
// //   }
// // });








































// // import express from 'express';
// //  import { __dirname } from './utils.js';
// //  import { errorHandler } from './middlewares/errorHandler.js';
// //  import handlebars from 'express-handlebars';
// //  import { Server } from 'socket.io';
// //  import viewsRouter from './routes/views.router.js';
// // import productsRouter from '../src/routes/api/products.router.js';
// //  import ProductsManager from './managers/product.manager.js';
// //  import CartManager from './managers/cart.manager.js';
// //  import MessageManager from './managers/messages.manager.js';
// //  import morgan from 'morgan';
// // import userRouter from './routes/users.router.js';
// // import cartRouter from './routes/api/cart.router.js';

// // import { initMongoDB } from './daos/mongodb/connection.js';
// // //import { initMongoDB } from '../src/conexion.js';
// // import 'dotenv/config';



// // //import express from 'express';
// // //import morgan from 'morgan';
// // //import productsRouter from './routes/product.router.js';
// // //import { errorHandler } from './middlewares/errorHandler.js';
// // //import { initMongoDB } from './daos/mongodb/connection.js';

// // const app = express();

// // app.use(express.json());
// // app.use(express.urlencoded({extended: true}));
// // app.use(morgan('dev'));

// // app.use('/products', productsRouter);

// // app.use(errorHandler);

// // const PERSISTENCE = 'mongo';

// // if(PERSISTENCE === 'mongo') initMongoDB();

// // const PORT = 8080;

// // app.listen(PORT, () => console.log(`SERVER UP ON PORT ${PORT}`));







// // //const app = express();
// // //const PORT = process.env.PORT || 8080;

// // // Middlewares
// // app.use(express.json());
// // app.use(express.urlencoded({ extended: true }));
// // app.use(morgan('dev'));
// // app.use(express.static(__dirname + '/public'));

// // // Configura el motor de plantillas
// // app.engine('handlebars', handlebars.engine());
// // app.set('view engine', 'handlebars');
// // app.set('views', `${__dirname}/views`);

// // // Inicializa la conexión a MongoDB si está configurado
// // if (process.env.PERSISTENCE === 'MONGO') {
// //   initMongoDB();
// // }

// // // Inicializa ProductManager, CartManager y MessageManager
// // const productManager = new ProductsManager(`${__dirname}/db/products.json`);
// // const cartManager = new CartManager(`${__dirname}/db/carts.json`);
// // const messageManager = new MessageManager(`${__dirname}/db/messages.json`);
// // // // Inicializa ProductManager, CartManager y MessageManager

// // // Rutas
// // app.use('/', viewsRouter);
// // app.use('/chat', viewsRouter);
// // app.use('/realTimeProducts', viewsRouter);
// // app.use('/api/products', productsRouter);
// // app.use('/api/carts', cartRouter);
// // app.use('/vista1', viewsRouter);
// // app.use('/vista2', viewsRouter);
// // app.use('/websocket', viewsRouter);
// // app.use('/users', userRouter);
// // app.use('/products', productsRouter);
// // app.use('/carts', cartRouter);

// // // Manejo de errores
// // app.use(errorHandler);

// //  //Inicia el servidor HTTP
// // const httpServer = app.listen(PORT, () => {
// //   console.log(`🚀 Server listening on port ${PORT}`);
// // });

// // // Configura el servidor de Socket.io
// // const socketServer = new Server(httpServer);

// // socketServer.on('connection', async (socket) => {
// //   console.log('🟢 ¡New connection!', socket.id);

// //   // Emitir productos actuales a los clientes
// //   socketServer.emit('products', await productManager.getProducts());

// //   socket.on('disconnect', () => {
// //     console.log('🔴 User disconnect', socket.id);
// //   });

// //   socket.on('newUser', (user) => {
// //     console.log(`> ${user} ha iniciado sesión`);
// //     socket.broadcast.emit('newUser', user);
// //   });

// //   socket.on('addProductToCart', async ({ cartId, productId }) => {
// //     try {
// //       const updatedCart = await cartManager.saveProductToCart(cartId, productId);
// //       socket.emit('productAdded', updatedCart);
// //     } catch (error) {
// //       socket.emit('error', error.message);
// //     }
// //   });

// //   socket.on('removeProductFromCart', async (productId) => {
// //     // Lógica para eliminar el producto del carrito
// //     socket.emit('productRemoved', productId);
// //   });

// //   socket.on('chat:message', async (msg) => {
// //     await messageManager.createMsg(msg);
// //     socketServer.emit('messages', await messageManager.getAll());
// //   });

// //   socket.on('chat:typing', (username) => {
// //     socket.broadcast.emit('chat:typing', username);
// //   });
// // });

// // // Define rutas adicionales
// // app.get('/products', async (req, res) => {
// //   const products = await productManager.getProducts();
// //   res.json(products);
// // });

// // app.post('/cart', async (req, res) => {
// //   const { cartId, productId } = req.body;
// //   try {
// //     const updatedCart = await cartManager.saveProductToCart(cartId, productId);
// //     res.status(200).json(updatedCart);
// //   } catch (error) {
// //     res.status(500).json({ message: error.message });
// //   }
// // });

// // app.post('/products/add', async (req, res) => {
// //   try {
// //     const { title, description, code, price, stock, category } = req.body;
// //     const newProduct = await productManager.createProduct({ title, description, code, price, stock, category });
// //     res.status(201).json(newProduct);
// //   } catch (error) {
// //     console.error("Error al agregar el producto:", error);
// //     res.status(500).send("Error al agregar el producto");
// //   }
// // });
