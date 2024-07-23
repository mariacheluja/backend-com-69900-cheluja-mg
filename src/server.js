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
import authRoutes from "./routes/auth.router.js";
import sessionRouter from './routes/session.router.js'; // Corrige aquí para importar correctamente

import session from "express-session";
import FileStoreFactory from 'session-file-store';
import cookieParser from "cookie-parser";

// login autenticacion y contraseña
import passport from "passport";
import { initializePassport } from "./config/passport.config.js";

//configuracion del login con jwt
import { generateToken, authToken } from "./utils/jwtFuntions.js";

const FileStore = FileStoreFactory(session);

const app = express();
const PORT = process.env.PORT || 8080;

// Configuración de middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(morgan('dev'));
app.use(cookieParser());

// Configuración del File Store
app.use(session({
  store: new FileStore({ path: "./sessions", ttl: 100, retries: 0 }), // colocar la ruta 
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

// Configuración de Handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

// Rutas
app.use("/api/session", sessionRouter); // Corregido aquí
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/users", userRouter);
app.use("/chat", viewsRouter);
app.use("/realTimeProducts", viewsRouter);
app.use("/vista1", viewsRouter);
app.use("/vista2", viewsRouter);
app.use("/websocket", viewsRouter);
app.use("/products", productsRouter);

// Middleware para manejo de errores
app.use(errorHandler);

// Inicialización de la base de datos
initMongoDB();

// Configuración del servidor y socket.io
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

// Additional routes para verificar que el servidor esté funcionando

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

// Passport config
initializePassport(); // inicializamos la funcion
app.use(passport.initialize()); 
app.use(passport.session()); //session maneja el pasport por nosotros

// codigo para loguearte usandom JWT 

// BD
const users = [];

// Express config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.post("/register", (req, res) => {
  const { first_name, last_name, email, password,role } = req.body;

  if (!first_name || !email || !password) {
    return res.status(400).json({
      error: "Falta información",
    });
  }

  const user = {
    first_name,
    last_name,
    email,
    password,
    role,
   
  };

  users.push(user);
  res.json({ message: "Usuario registrado" });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Falta información",
    });
  }

  const user = users.find((user) => user.email === email);

  if (!user) {
    return res.status(404).json({
      error: "Usuario no encontrado",
    });
  }

  if (user.password !== password) {
    return res.status(401).json({
      error: "Contraseña incorrecta",
    });
  }

  const token = generateToken({ email: user.email });

  res.json({
    message: "Sesión iniciada",
    token,
  });
});

app.get("/profile", authToken, (req, res) => {
  res.json(req.user);
});

app.get("/users", authToken, (req, res) => {
  res.json(users);
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

// import viewsRouter from './routes/views.router.js';
// import productsRouter from '../src/routes/api/products.router.js';
// import userRouter from './routes/users.router.js';
// import cartRouter from './routes/api/cart.router.js';

// import session from "express-session";
// import FileStoreFactory from 'session-file-store';
// import cookieParser from "cookie-parser";
// import sessionroutes from './routes/session.router.js'; // Asegúrate de que la ruta del archivo sea correcta
// import viewsrouter from './routes/views.router.js';
// // login autenticacion y contraseña

// import passport from "passport";
// import { initializePassport } from "./config/passport.config.js";

// //import {  createHash, comparePassword } from "../src/utils/jwtFuntions.js";
// //import { generateToken, verifyToken } from "../src/utils/jwtFuntions.js";

// const FileStore = FileStoreFactory(session);

// const app = express();
// const PORT = process.env.PORT || 8080;

// // Configuración de middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(__dirname + "/public"));
// app.use(morgan('dev'));
// app.use(cookieParser());
// // Routes
// app.use("/api/sessionRouter");
// app.use("/", viewsRoutes);
// app.use("/api/sessions", sessionRoutes);
// app.use("/", viewsRoutes);


// // Configuración del File Store
// app.use(session({
//   store: new FileStore({ path: "./sessions", ttl: 100, retries: 0 }), // colocar la ruta 
//   secret: 'secret',
//   resave: false,
//   saveUninitialized: false
// }));

// // Configuración de Handlebars
// app.engine("handlebars", handlebars.engine());
// app.set("view engine", "handlebars");
// app.set("views", __dirname + "/views");

// // Rutas
// app.use("/api/products", productsRouter);
// app.use("/api/carts", cartRouter);
// app.use("/", viewsRouter);
// app.use("/chat", viewsRouter);
// app.use("/realTimeProducts", viewsRouter);
// app.use("/users", userRouter);
// app.use("/vista1", viewsRouter);
// app.use("/vista2", viewsRouter);
// app.use("/websocket", viewsRouter);
// app.use("/products", productsRouter);

// // Middleware para manejo de errores
// app.use(errorHandler);

// // Inicialización de la base de datos
// initMongoDB();

// // Configuración del servidor y socket.io
// const httpServer = app.listen(PORT, () => {
//   console.log(`🚀 Server listening on port ${PORT}`);
// });

// const socketServer = new Server(httpServer);

// const productManager = new ProductsManager(`${__dirname}/db/products.json`);
// const cartManager = new CartManager(`${__dirname}/db/carts.json`);
// const messageManager = new MessageManager(`${__dirname}/db/messages.json`);

// socketServer.on('connection', async (socket) => {
//   console.log('🟢 ¡New connection!', socket.id);

//   // Emit current products to clients
//   socketServer.emit('products', await productManager.getProducts());

//   socket.on('disconnect', () => {
//     console.log('🔴 User disconnect', socket.id);
//   });

//   socket.on('newUser', (user) => {
//     console.log(`> ${user} ha iniciado sesión`);
//     socket.broadcast.emit('newUser', user);
//   });

//   socket.on('addProductToCart', async ({ cartId, productId }) => {
//     try {
//       const updatedCart = await cartManager.saveProductToCart(cartId, productId);
//       socket.emit('productAdded', updatedCart);
//     } catch (error) {
//       socket.emit('error', error.message);
//     }
//   });

//   socket.on('removeProductFromCart', async (productId) => {
//     // Logic to remove the product from the cart
//     socket.emit('productRemoved', productId);
//   });

//   socket.on('chat:message', async (msg) => {
//     await messageManager.createMsg(msg);
//     socketServer.emit('messages', await messageManager.getAll());
//   });

//   socket.on('chat:typing', (username) => {
//     socket.broadcast.emit('chat:typing', username);
//   });
// });

// // Additional routes para verificar que el servidor esté funcionando

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
//     console.error("Error adding the product:", error);
//     res.status(500).send("Error adding the product");
//   }
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

// // Passport config
// initializePassport(); // inicializamos la funcion
// app.use(passport.initialize()); 
// app.use(passport.session()); //session maneja el pasport por nosotros





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

// import viewsRouter from './routes/views.router.js';
// import productsRouter from '../src/routes/api/products.router.js';
// import userRouter from './routes/users.router.js';
// import cartRouter from './routes/api/cart.router.js';
// import FileStore from 'session-file-store';
// //import { engine } from 'express-handlebars';
// //import { fileURLToPath } from 'url';
// //import path from 'path';
// import session  from "express-session";
// import cookieParser from "cookie-parser";

// //const app = express();
// const PORT = process.env.PORT || 8080;


// //configuracion del File Store
// const FileStore = FileStore(session);
// const app = express();
// app.use(session({
//   store: new FileStore({path: "./sessions", ttl: 100, retries:0}), // colocar la ruta 
//   secret: 'secret',
//   resave: false,
//   saveUninitialized: false
// }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(__dirname + "/public"));
// app.use(morgan('dev'));

// // Set up Handlebars
// app.engine("handlebars", handlebars.engine());
// app.set("view engine", "handlebars");
// app.set("views", __dirname + "/views");

// // Routes
// app.use("/api/products", productsRouter);
// app.use("/api/carts", cartRouter);
// app.use("/", viewsRouter);
// app.use("/chat", viewsRouter);
// app.use("/realTimeProducts", viewsRouter);
// app.use("/users", userRouter);
// app.use("/vista1", viewsRouter);
// app.use("/vista2", viewsRouter);
// app.use("/websocket", viewsRouter);
// app.use("/products", productsRouter);

// // Error handler middleware
// app.use(errorHandler);

// // Database initialization
// initMongoDB();
// // configuro para que me diga el puerto
// const httpServer = app.listen(PORT, () => {
//   console.log(`🚀 Server listening on port ${PORT}`);
// });

// const socketServer = new Server(httpServer);

// const productManager = new ProductsManager(`${__dirname}/db/products.json`);
// const cartManager = new CartManager(`${__dirname}/db/carts.json`);
// const messageManager = new MessageManager(`${__dirname}/db/messages.json`);

// socketServer.on('connection', async (socket) => {
//   console.log('🟢 ¡New connection!', socket.id);

//   // Emit current products to clients
//   socketServer.emit('products', await productManager.getProducts());

//   socket.on('disconnect', () => {
//     console.log('🔴 User disconnect', socket.id);
//   });

//   socket.on('newUser', (user) => {
//     console.log(`> ${user} ha iniciado sesión`);
//     socket.broadcast.emit('newUser', user);
//   });

//   socket.on('addProductToCart', async ({ cartId, productId }) => {
//     try {
//       const updatedCart = await cartManager.saveProductToCart(cartId, productId);
//       socket.emit('productAdded', updatedCart);
//     } catch (error) {
//       socket.emit('error', error.message);
//     }
//   });

//   socket.on('removeProductFromCart', async (productId) => {
//     // Logic to remove the product from the cart
//     socket.emit('productRemoved', productId);
//   });

//   socket.on('chat:message', async (msg) => {
//     await messageManager.createMsg(msg);
//     socketServer.emit('messages', await messageManager.getAll());
//   });

//   socket.on('chat:typing', (username) => {
//     socket.broadcast.emit('chat:typing', username);
//   });
// });

// // Additional routes verificamos que el servidor este funcionado

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
//     console.error("Error adding the product:", error);
//     res.status(500).send("Error adding the product");
//   }
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



// app.use (cookieParser());






































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
