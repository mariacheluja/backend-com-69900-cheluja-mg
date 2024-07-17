//server.js original


// import express from 'express';  //creo el servidor con express/express
// //import cartRouter from '../src/routes/api/cart.router.js';
// //import productsRouter from '../src/routes/api/products.router.js';
// import morgan from 'morgan';
// import { __dirname } from '../src/path.js';
// import { errorHandler } from './middlewares/errorHandler.js';
// import handlebars from 'express-handlebars'; // llamoa a handlebars
// import viewsRouter from './routes/views.router.js';

// //chat gpt
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { engine } from 'express-handlebars';
// import router from './routes/views.router.js';

// const app = express()

// app.use(express.static(__dirname + '/public'))
// app.use(express.json())
// app.use(express.urlencoded({extended:true}))
// app.use(morgan('dev'))

// app.use(express.static(__dirname + '/public')); // llamo a la carpeta public para llamar a archivos publicos
// app.engine('handlebars', handlebars.engine()); //llamo a la funcionalidad de handlebars con toda su libreria.
// app.set('views', __dirname + '/views'); // llamo a la carpeta views para llamar a archivos de plantillas    
// app.set('views engine', 'handlebars'); // llamo a la funcionalidad de handlebars con toda su libreria.
// app.use("/",viewsRouter); // creo un enrutador

// //app.use('/api/carts', cartRouter);
// //app.use('/api/products', productsRouter);

// app.use(errorHandler);

// const PORT = 8080  // guardo el puerto en una constante

// app.listen(PORT,()=>{
//     console.log(`Escuchando en el puerto ${PORT}`)
// })   // console log para probar que el server funciona


//chat gpt

// import express from 'express';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { create } from 'express-handlebars';
// import router from './routes/views.router.js';
// import {Server} from 'socket.io';
// const app = express();
// const PORT = 8080;

// // Determinar __dirname para ESModules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Configuración del motor de plantillas Handlebars
// const hbs = create({
//   extname: '.handlebars', // Extensión para los archivos de plantilla
// });
// app.engine('.handlebars', hbs.engine);
// app.set('view engine', '.handlebars');
// app.set('views', path.join(__dirname, 'views'));

// // Middleware para servir archivos estáticos
// app.use(express.static(path.join(__dirname, 'public')));

// // Usar el router
// app.use('/', router);

// app.get('/', function(req, res) { // llamo a la plantilla de websocket
//   res.render('websocket');
// });
// // Iniciar el servidor y lo guardo en una constante para que no genere conflicto con websocket
// const httpServer = app.listen(PORT, () => {
//     console.log(`Escuchando en el puerto ${PORT}`);
// });

// const socketServer = new Server(httpServer); //conexion hecha del lado del servidor
// socketServer.on("conection"), (socket) => { // escucho el evento cuando se conecta el cliente
//     console.log("El cliente se ha conectado:${socket.id}");
// }

//socket segun chat gpt
// import express from 'express';
// import http from 'http';
// import { Server } from 'socket.io';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { create } from 'express-handlebars';
// import router from './routes/views.router.js';

// const app = express();
// const PORT = 8080;

// // Determinar __dirname para ESModules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Configuración del motor de plantillas Handlebars
// const hbs = create({
//   extname: '.handlebars', // Extensión para los archivos de plantilla
// });
// app.engine('.handlebars', hbs.engine);
// app.set('view engine', '.handlebars');
// app.set('views', path.join(__dirname, 'views'));

// // Middleware para servir archivos estáticos
// app.use(express.static(path.join(__dirname, 'public')));

// // Usar el router
// app.use('/', router);

// // Crear servidor HTTP
// const server = http.createServer(app);

// // Configuración de Socket.io
// const io = new Server(server);

// io.on('connection', (socket) => {
//     console.log(`Un cliente se ha conectado: ${socket.id}`);

//     // Manejar la desconexión del cliente
//     socket.on('disconnect', () => {
//         console.log(`El cliente ${socket.id} se ha desconectado`);
//     });

//     // Envío de un mensaje de saludo a todos los clientes conectados
//     io.emit('saludos desde socket', 'Bienvenido a WebSocket');
// });

// // Iniciar el servidor
// server.listen(PORT, () => {
//     console.log(`Escuchando en el puerto ${PORT}`);
// });


//con esto funciona la vista chat


// import express from 'express';
// import { __dirname } from './utils.js';
// import { errorHandler } from './middlewares/errorHandler.js';
// import handlebars from 'express-handlebars';
// import { Server } from 'socket.io';
// import viewsRouter from './routes/views.router.js';
// import ProductsManager from './managers/product.manager.js';
// const productsManager = new ProductsManager(`${__dirname}/db/products.json`);
// // console.log(process.cwd())

// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({extended:true}));
// app.use(express.static(__dirname + '/public'));

// app.engine('handlebars', handlebars.engine()); 
// app.set('view engine', 'handlebars');  
// app.set('views', __dirname+'/views');  

// app.use('/chat', viewsRouter);

// app.use(errorHandler);

// const httpServer = app.listen(8080, ()=>{
//     console.log('🚀 Server listening on port 8080');
// });

// const socketServer = new Server(httpServer);

// socketServer.on('connection', async(socket)=>{
//     console.log('🟢 ¡New connection!', socket.id);

//     socketServer.emit('messages', await productsManager.getAll());

//     socket.on('disconnect', ()=>{
//         console.log('🔴 User disconnect', socket.id);
//     })

//     socket.on('newUser', (user)=>{
//         console.log(`> ${user} ha iniciado sesión`);
//         socket.broadcast.emit('newUser', user);
//     })

//     socket.on('chat:message', async(msg) => {
//         await productsManager.createMsg(msg);
//         socketServer.emit('messages', await productsManager.getAll());
//     })

//     socket.on('chat:typing', (username)=>{
//         socket.broadcast.emit('chat:typing', username)
//     })

    
// })

//cart.router

// import { Router } from "express";
// import CartManager from "../../managers/cart.manager.js";
// import { __dirname } from "../../utils.js";

// const router = Router();
// const cartManager = new CartManager(`${__dirname}/db/carts.json`);

// // Ruta para agregar un producto al carrito
// router.post("/:idCart/product/:idProd", async (req, res, next) => {
//   try {
//     const { idProd, idCart } = req.params;
//     const response = await cartManager.saveProductToCart(idCart, idProd);
//     res.json(response);
//   } catch (error) {
//     next(error);
//   }
// });

// // Ruta para crear un nuevo carrito
// router.post("/", async (req, res) => {
//   try {
//     const newCart = await cartManager.createCart();
//     res.json(newCart);
//   } catch (error) {
//     res.status(500).json(error.message);
//   }
// });

// // Ruta para obtener un carrito por ID
// router.get("/:idCart", async (req, res) => {
//   try {
//     const { idCart } = req.params;
//     const cart = await cartManager.getCartById(idCart);
//     res.json(cart);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error.message);
//   }
// });

// export default router;




//viewrouter




// import { router } from "express";
// import express from 'express';

// const router = Router();

// router.get('/', (req, res) => {

//     res.render("vista1");// falta el nombre de la plantilla
// });

// export default router;

// import express from 'express';
// //import { router } from "express";

// const router = express.Router();

// router.get('/', (req, res) => {    // toma por defecto la principal
//     res.render("vista1"); // Asegúrate de tener el nombre de la plantilla correcto
// });

// router.get('/vista1', (req, res) => {
//     console.log('Ruta de vista1 alcanzada');
//     res.render("vista1"); // Asegúrate de tener el nombre de la plantilla correcto
// });

// router.get('/vista2', (req, res) => { //como no es la principal tengo que indicarle cual es la vista que quiero
//     res.render("vista2"); // Asegúrate de tener el nombre de la plantilla correcto
// });

// router.get('/realTimeProducts', (req, res) => { //como no es la principal tengo que indicarle cual es la vista que quiero
//     res.render("realTimeProducts"); // Asegúrate de tener el nombre de la plantilla correcto
// });

// export default router;


// En tu archivo views.router.js

// import express from 'express';
// import ProductManager from '../managers/productManager.js'; // Asegúrate de tener la ruta correcta al archivo del ProductManager

// const router = express.Router();

// // Importa tu ProductsManager aquí
// //import ProductsManager from '../managers/product.manager.js';
// const productsManager = new ProductsManager(`${__dirname}/db/products.json`);

// router.get('/', (req, res) => {
//     res.render("vista1"); // Renderiza la vista principal aquí
// });

// router.get('/vista1', (req, res) => {
//     res.render("vista1"); // Renderiza la vista 1
// });

// router.get('/vista2', (req, res) => {
//     res.render("vista2"); // Renderiza la vista 2
// });

// router.get('/realTimeProducts', async (req, res) => {
//     const products = await productsManager.getProducts();
//     res.render("realTimeProducts", { products }); // Renderiza la vista de productos en tiempo real
// });

// // export default router;
// import express from 'express';
// import ProductManager from '../managers/product.manager.js'; //Ruta correcta al archivo del ProductManager


// const router = express.Router();

// // Inicializa el ProductManager con la ruta al archivo JSON de productos
// const productManager = new ProductManager(`${__dirname}/../db/products.json`); // Crea una instancia de ProductManager

// router.get('/', async (req, res) => {
//     // Obtiene la lista de productos
//     const products = await productsManager.getProducts();
    
//     // Renderiza la vista 'vista1' y pasa los productos como datos
//     res.render("vista1", { products });
// });

// router.get('/vista1', async (req, res) => {
//     // Obtiene la lista de productos
//     const products = await productsManager.getProducts();
    
//     // Renderiza la vista 'vista1' y pasa los productos como datos
//     res.render("vista1", { products });
// });

// router.get('/vista2', async (req, res) => {
//     // Obtiene la lista de productos
//     const products = await productsManager.getProducts();
    
//     // Renderiza la vista 'vista2' y pasa los productos como datos
//     res.render("vista2", { products });
// });

// router.get('/realTimeProducts', async (req, res) => {
//     // Obtiene la lista de productos
//     const products = await productsManager.getProducts();
    
//     // Renderiza la vista 'realTimeProducts' y pasa los productos como datos
//     res.render("realTimeProducts", { products });
// });

// export default router;






// import { productsManager } from "../managers/product.manager.js";
// import { Router } from "express";

// const router = Router();

// router.get('/', (req, res) => {
//     res.render('chat');
// });

// router.get('/vista1', (req, res) => {
//     res.render('vista1');
// });

// router.get('/vista2', (req, res) => {
//     res.render('vista2', { layout: 'main.handlebars' });
// });

// router.get('/websocket', (req, res) => {
//     res.render('navbar');
// });

// // Ruta para obtener productos en tiempo real
// router.get('/realTimeProducts', async (req, res) => {
//     try {
//         const products = await productsManager.getProducts();
//         res.render('realTimeProducts', { products });
//     } catch (error) {
//         console.error('Error al obtener productos:', error);
//         res.status(500).send('Error al obtener productos');
//     }
// });

// export default router;


//viewrouter



// import { productsManager } from "../managers/product.manager.js";
// import { Router } from "express";

// const router = Router();

// router.get('/', (req, res) => {
//     res.render('chat');
// });

// router.get('/vista1', (req, res) => {
//     res.render('vista1');
// });

// router.get('/vista2', (req, res) => {
//     res.render('vista2', { layout: 'realTimeProducts.handlebars' });
// });

// router.get('/websocket', (req, res) => {
//     res.render('navbar');
// });

// // Ruta para obtener productos en tiempo real
// router.get('/realTimeProducts', async (req, res) => {
//     try {
//         const products = await productsManager.getProducts();
//         res.render('realTimeProducts', { products });
//     } catch (error) {
//         console.error('Error al obtener productos:', error);
//         res.status(500).send('Error al obtener productos');
//     }
// });

// export default router;


//productmanager



// import fs from "fs";
// import { v4 as uuidv4 } from "uuid";

// export default class ProductManager {
//     constructor(path) {
//         this.path = path;
//     }

//     async getProducts(limit = undefined) {
//         try {
//             if (fs.existsSync(this.path)) {
//                 const products = await fs.promises.readFile(this.path, "utf8");
//                 let parsedProducts = JSON.parse(products);

//                 if (limit !== undefined && !isNaN(limit)) {
//                     return parsedProducts.slice(0, parseInt(limit));
//                 }

//                 return parsedProducts;
//             } else {
//                 return [];
//             }
//         } catch (error) {
//             console.log(error);
//             return [];
//         }
//     }

//     async createProduct({ title, description, code, price, stock, category }) {
//         try {
//             const product = {
//                 id: uuidv4(),
//                 status: true,
//                 title,
//                 description,
//                 code,
//                 price: parseFloat(price),
//                 stock: parseInt(stock),
//                 category
//             };
//             const products = await this.getProducts();
//             products.push(product);
//             await fs.promises.writeFile(this.path, JSON.stringify(products));
//             return product;
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     async getProductById(id) {
//         try {
//             const products = await this.getProducts();
//             const productExist = products.find((p) => p.id === id);
//             if (!productExist) return null;
//             return productExist;
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     async updateProduct(obj, id) {
//         try {
//             const products = await this.getProducts();
//             let productExist = await this.getProductById(id);
//             if (!productExist) return null;
//             productExist = { ...productExist, ...obj };
//             const newArray = products.filter((u) => u.id !== id);
//             newArray.push(productExist)
//             await fs.promises.writeFile(this.path, JSON.stringify(newArray));
//             return productExist;
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     async deleteProduct(id) {
//         const products = await this.getProducts();
//         if (products.length > 0) {
//             const productExist = await this.getProductById(id);
//             if (productExist) {
//                 const newArray = products.filter((u) => u.id !== id);
//                 await fs.promises.writeFile(this.path, JSON.stringify(newArray));
//                 return productExist
//             }
//         } else return null
//     }

//     async deleteFile() {
//         try {
//             await fs.promises.unlink(this.path);
//             console.log("archivo eliminado");
//         } catch (error) {
//             console.log(error);
//         }
//     }
// }




//otra prueba

// // Importar los módulos necesarios y el ProductManager
// import express from "express";
// import ProductManager from "./ProductManager.js";

// // Crear una instancia de Express y el ProductManager
// const app = express();
// const productManager = new ProductManager('path/to/products.json');

// // Configurar middleware para parsear datos de formularios
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // Ruta POST para agregar un nuevo producto
// app.post("/products/add", async (req, res) => {
//     try {
//         const { title, description, code, price, stock, category } = req.body;
//         const newProduct = await productManager.createProduct({ title, description, code, price, stock, category });
//         res.status(201).json(newProduct);
//     } catch (error) {
//         console.error("Error al agregar el producto:", error);
//         res.status(500).send("Error al agregar el producto");
//     }
// });

// // Iniciar el servidor
// const PORT = 3000;
// app.listen(PORT, () => {
//     console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
// });


//otra prueba

// // Importar express y el ProductManager
// import express from "express";
// import ProductManager from "./ProductManager.js";

// // Crear una instancia de Express y el ProductManager
// const app = express();
// const productManager = new ProductManager('path/to/products.json');

// Configurar middleware para analizar datos de formularios
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // Ruta POST para agregar un nuevo producto
// app.post("/products/add", async (req, res) => {
//     try {
//         const { title, description, code, price, stock, category } = req.body;
//         const newProduct = await productManager.createProduct({ title, description, code, price, stock, category });
//         res.status(201).json(newProduct);
//     } catch (error) {
//         console.error("Error al agregar el producto:", error);
//         res.status(500).send("Error al agregar el producto");
//     }
// });

// // Iniciar el servidor
// const PORT = 3000;
// app.listen(PORT, () => {
//     console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
// });




//otra prueba
// import express from 'express';
// import { __dirname } from './utils.js';
// import { errorHandler } from './middlewares/errorHandler.js';
// import handlebars from 'express-handlebars';
// import { Server } from 'socket.io';
// import viewsRouter from './routes/views.router.js';
// import cartRouter from './routes/api/cart.router.js';
// import productsRouter from './routes/api/products.router.js';

// import ProductsManager from './managers/product.manager.js';
// import CartManager from './managers/cart.manager.js';
// import MessageManager from './managers/messages.manager.js';

// const app = express();

// // Inicializa ProductManager, CartManager y MessageManager
// const productManager = new ProductsManager(`${__dirname}/db/products.json`);
// const cartManager = new CartManager(`${__dirname}/db/messages.json`);
// const messageManager = new MessageManager(`${__dirname}/db/messages.json`);

// // Configurar middleware para parsear datos de formularios
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(express.static(__dirname + '/public'));

// app.engine('handlebars', handlebars.engine());
// app.set('view engine', 'handlebars');
// app.set('views', `${__dirname}/views`);

// app.use('/', viewsRouter);
// app.use('/chat', viewsRouter);
// app.use('/realTimeProducts', viewsRouter);
// app.use('/api/products', productsRouter);
// app.use('/api/carts', cartRouter);
// app.use('/vista1', viewsRouter);
// app.use('/vista2', viewsRouter);
// app.use('/websocket', viewsRouter);
// app.use(errorHandler);

// const httpServer = app.listen(8080, () => {
//   console.log('🚀 Server listening on port 8080');
// });

// const socketServer = new Server(httpServer);

// socketServer.on('connection', async (socket) => {
//   console.log('🟢 ¡New connection!', socket.id);

//   // Emitir productos actuales a los clientes
//   socketServer.emit('products', await productManager.getProducts());

//   socket.on('disconnect', () => {
//     console.log('🔴 User disconnect', socket.id);
//   });

//   socket.on('newUser', (user) => {
//     console.log(`> ${user} ha iniciado sesión`);
//     socket.broadcast.emit('newUser', user);
//   });

//   socket.on('addProductToCart', async (productId) => {
//     const product = await productManager.getProductById(productId);
//     if (product) {
//       // Aquí podrías añadir lógica para agregar el producto a un carrito
//       socket.emit('productAdded', product);
//     } else {
//       socket.emit('error', 'Product not found');
//     }
//   });

//   socket.on('removeProductFromCart', async (productId) => {
//     // Lógica para eliminar el producto del carrito
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

// // Ruta para agregar un producto
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


//enrutador

// import { Router } from 'express';
// import ProductsManager from '../../managers/product.manager.js';
// import { __dirname } from '../../utils.js';

// const router = Router();
// const productManager = new ProductsManager(`${__dirname}/db/products.json`);

// router.post('/add', async (req, res) => {
//   try {
//     const { title, description, code, price, stock, category } = req.body;
//     const newProduct = await productManager.createProduct({ title, description, code, price, stock, category });
//     res.status(201).json(newProduct);
//   } catch (error) {
//     console.error("Error al agregar el producto:", error);
//     res.status(500).send("Error al agregar el producto");
//   }
// });

// export default router;


// import express from 'express'; //creo el servidor con express/express
// import { __dirname } from './utils.js'; //importo dirname path no lo necesito, borrar.
// import { errorHandler } from './middlewares/errorHandler.js'; //traigo la plantilla de errores
// import handlebars from 'express-handlebars'; //llamo a handlebars
// import { Server } from 'socket.io'; //creo el servidor con socket
// import viewsRouter from './routes/views.router.js'; //llemo a  viewrouter
// import cartRouter from '../src/routes/api/cart.router.js';
// import productsRouter from '../src/routes/api/products.router.js';
// //import cartRouter from './routes/api/cart.router.js';
// //import productsRouter from './routes/api/products.router.js';

// import ProductsManager from './managers/product.manager.js';
// //const productManager = new ProductsManager(`${__dirname}/db/products.json`);
// import CartManager from './managers/cart.manager.js';
// //const cartManager = new CartManager(`${__dirname}/db/messages.json`);
// import MessageManager from './managers/messages.manager.js';
// //const messageManager = new MessageManager(`${__dirname}/db/messages.json`);


// const app = express();
// // Inicializa ProductsManager
// const productManager = new ProductsManager(`${__dirname}/db/products.json`);
// const cartManager = new CartManager(`${__dirname}/db/messages.json`);
// const messageManager = new MessageManager(`${__dirname}/db/messages.json`);


// // Crear una instancia de Express y el ProductManager

// //const productManager = new ProductManager('path/to/products.json');

// // Configurar middleware para parsear datos de formularios




//este rompio todo
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(express.static(__dirname + '/public'));

// app.engine('handlebars', handlebars.engine()); // configuro handlebars
// app.set('view engine', 'handlebars'); //el motor en handlebars
// app.set('views', `${__dirname}/views`); //llamo a las vistas en la carpeta views


// app.use('/', viewsRouter); //creo el enrutador 
// app.use('/chat', viewsRouter);
// app.use('/realTimeProducts', viewsRouter);
// app.use('/api/products', productsRouter);
// app.use('/api/carts', cartRouter);
// app.use('/vista1', viewsRouter);
// app.use('/vista2', viewsRouter);
// app.use('/websocket', viewsRouter);
// app.use(errorHandler);


// const httpServer = app.listen(8080, () => {
//   console.log('🚀 Server listening on port 8080');
// });

// const socketServer = new Server(httpServer);

// socketServer.on('connection', async (socket) => {
//   console.log('🟢 ¡New connection!', socket.id);

//   // Emitir productos actuales a los clientes
//   socketServer.emit('products', await productsManager.getProducts());

//   socket.on('disconnect', () => {
//     console.log('🔴 User disconnect', socket.id);
//   });

//   socket.on('newUser', (user) => {
//     console.log(`> ${user} ha iniciado sesión`);
//     socket.broadcast.emit('newUser', user);
//   });

//   socket.on('addProductToCart', async (productId) => {
//     const product = await productsManager.getProductById(productId);
//     if (product) {
//       // Aquí  añadir lógica para agregar el producto a un carrito
//       socket.emit('productAdded', product);
//     } else {
//       socket.emit('error', 'Product not found');
//     }
//   });

//   socket.on('removeProductFromCart', async (productId) => {
//     // Lógica para eliminar el producto del carrito
//     socket.emit('productRemoved', productId);
//   });

//   socket.on('chat:message', async(msg) => {  //guardo en el json
//     await messageManager.createMsg(msg); //llamamos al message Manage, lo creamos y le pasamos un objeto
//     socketServer.emit('messages', await messageManager.getAll()); // emitimos los mensajes a todos y nos devuelve un array
//   });

//   socket.on('chat:typing', (username) => {
//     socket.broadcast.emit('chat:typing', username);
//   });
// });



// app.get('/products', async (req, res) => {
//   const products = await productsManager.getProducts();
//   res.json(products);
// });

// app.post('/cart', async (req, res) => {
//   const { productId } = req.body;
//   const product = await productsManager.getProductById(productId);
//   if (product) {
//     // Lógica para agregar el producto al carrito
//     res.status(200).json({ message: 'Product added to cart', product });
//   } else {
//     res.status(404).json({ message: 'Product not found' });
//   }
// });

// app.delete('/cart/:productId', async (req, res) => {
//   const { productId } = req.params;
//   // Lógica para eliminar el producto del carrito
//   res.status(200).json({ message: 'Product removed from cart', productId });
// });


// app.post("/products/add", async (req, res) => {
//   try {
//       const { title, description, code, price, stock, category } = req.body;
//       const newProduct = await productManager.createProduct({ title, description, code, price, stock, category });
//       res.status(201).json(newProduct);
//   } catch (error) {
//       console.error("Error al agregar el producto:", error);
//       res.status(500).send("Error al agregar el producto");
//   }
// });

//cart manager prueba



// import fs from 'fs/promises';
// import path from 'path';

// class CartManager {
//   constructor(filePath) {
//     this.filePath = filePath;
//   }

//   async getCart() {
//     try {
//       const data = await fs.readFile(this.filePath, 'utf-8');
//       return JSON.parse(data);
//     } catch (error) {
//       return [];
//     }
//   }

//   async saveCart(cart) {
//     try {
//       await fs.writeFile(this.filePath, JSON.stringify(cart, null, 2));
//     } catch (error) {
//       console.error('Error saving cart:', error);
//     }
//   }

//   async addProductToCart(product) {
//     const cart = await this.getCart();
//     cart.push(product);
//     await this.saveCart(cart);
//     return cart;
//   }
// }

// export default CartManager;


//otro cart 

// Importaciones necesarias
// import { __dirname } from "../utils.js"; 
// import fs from "fs";
// import { v4 as uuidv4 } from "uuid";
// import ProductManager from "./product.manager.js";  // Importo ProductManager para usar sus métodos
// const productManager = new ProductManager(`${__dirname}/db/products.json`); // Apunto a la DB de productos

// export default class CartManager {
//   constructor(path) {
//     this.path = path;
//   }

//   // Función para obtener todos los carritos
//   async getAllCarts() {
//     try {
//       if (fs.existsSync(this.path)) {
//         const carts = await fs.promises.readFile(this.path, "utf-8");
//         return JSON.parse(carts);
//       } else {
//         return [];
//       }
//     } catch (error) {
//       console.log(error);
//       return [];
//     }
//   }

//   // Función para crear un nuevo carrito
//   async createCart() {
//     try {
//       const cart = {
//         id: uuidv4(),
//         products: [],  // Array vacío al crear un nuevo carrito
//       }
//       const carts = await this.getAllCarts();
//       carts.push(cart);
//       await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
//       return cart;
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   // Función para obtener un carrito por ID
//   async getCartById(id) {
//     try {
//       const carts = await this.getAllCarts();
//       const cart = carts.find((c) => c.id === id);
//       if (!cart) {
//         console.log('No se encontró ningún carrito con el ID proporcionado.');
//         return null;
//       }
//       return cart;
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   // Función para agregar un producto al carrito
//   async saveProductToCart(idCart, idProduct) {
//     try {
//       const cartExist = await this.getCartById(idCart);
//       if (!cartExist) throw new Error('Cart not found');
      
//       // Verificar si el producto ya existe en el carrito
//       const existProdInCart = cartExist.products.find((prod) => prod.product === idProduct);
//       if (!existProdInCart) {
//         // Si no existe, añadirlo con cantidad 1
//         const prod = {
//           product: idProduct,
//           quantity: 1
//         };
//         cartExist.products.push(prod);
//       } else {
//         // Si ya existe, incrementar la cantidad
//         existProdInCart.quantity += 1;
//       }

//       // Obtener todos los carritos y actualizar el carrito modificado
//       const carts = await this.getAllCarts();
//       const updatedCarts = carts.map((cart) => cart.id === idCart ? cartExist : cart);
      
//       // Guardar los carritos actualizados
//       await fs.promises.writeFile(this.path, JSON.stringify(updatedCarts, null, 2));
//       return cartExist;
//     } catch (err) {
//       console.log(err);
//     }
//   }
// }


//server

// import express from 'express';
// import { __dirname } from './utils.js';
// import { errorHandler } from './middlewares/errorHandler.js';
// import handlebars from 'express-handlebars';
// import { Server } from 'socket.io';
// import viewsRouter from './routes/views.router.js';
// import cartRouter from '../src/routes/api/cart.router.js';
// import productsRouter from '../src/routes/api/products.router.js';

// import ProductsManager from './managers/product.manager.js';
// import CartManager from './managers/cart.manager.js';
// import MessageManager from './managers/messages.manager.js';

// const app = express();
// const productManager = new ProductsManager(`${__dirname}/db/products.json`);
// const cartManager = new CartManager(`${__dirname}/db/carts.json`);
// const messageManager = new MessageManager(`${__dirname}/db/messages.json`);

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(express.static(__dirname + '/public'));

// app.engine('handlebars', handlebars.engine());
// app.set('view engine', 'handlebars');
// app.set('views', `${__dirname}/views`);

// app.use('/', viewsRouter);
// app.use('/chat', viewsRouter);
// app.use('/realTimeProducts', viewsRouter);
// app.use('/api/products', productsRouter);
// app.use('/api/carts', cartRouter);
// app.use('/vista1', viewsRouter);
// app.use('/vista2', viewsRouter);
// app.use('/websocket', viewsRouter);
// app.use(errorHandler);

// const httpServer = app.listen(8080, () => {
//   console.log('🚀 Server listening on port 8080');
// });

// const socketServer = new Server(httpServer);

// socketServer.on('connection', async (socket) => {
//   console.log('🟢 ¡New connection!', socket.id);

//   // Emitir productos actuales a los clientes
//   socket.emit('products', await productManager.getProducts());

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
//     // Lógica para eliminar el producto del carrito
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

// app.delete('/cart/:productId', async (req, res) => {
//   const { productId } = req.params;
//   // Lógica para eliminar el producto del carrito
//   res.status(200).json({ message: 'Product removed from cart', productId });
// });

// app.post("/products/add", async (req, res) => {
//   try {
//     const { title, description, code, price, stock, category } = req.body;
//     const newProduct = await productManager.createProduct({ title, description, code, price, stock, category });
//     res.status(201).json(newProduct);
//   } catch (error) {
//     console.error("Error al agregar el producto:", error);
//     res.status(500).send("Error al agregar el producto");
//   }
// });


//user controller pruebajsjs

// import * as service from "../services/user.services.js"; //exporto todo 



// export const getById = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const item = await service.getByIdUser(id);
//     if (!item) throw new Error("User not found!");

//     res.json(item);
//   } catch (error) {
//     next(error);
//   }
// };

// export const getByEmail = async (req, res, next) => {
//   try {
//     const { email } = req.params;
//     const item = await service.getByEmailUser(email);
//     if (!item) throw new Error("User not found!");
//     res.json(item);
//   } catch (error) {
//     next(error);
//   }
// };

// export const getAll = async (req, res, next) => {
//   try {
//     const { page, limit } = req.query;
//     const response = await service.getAllUsers(page, limit);
//     res.json(response);
//     // const next = response.hasNextPage ? `http://localhost:8080/users/all?page=${response.nextPage}` : null;
//     // const prev = response.hasPrevPage ? `http://localhost:8080/users/all?page=${response.prevPage}` : null;
//     // res.json({
//     //   payload: response.docs,
//     //   info: {
//     //     count: response.totalDocs,
//     //     pages: response.totalPages,
//     //     next,
//     //     prev
//     //   }
//     // })
//   } catch (error) {   //manejo el error
//     next(error);
//   }
// };

// export const create = async (req, res, next) => {
//   try {
//     const user = { ...req.body };
//     const newUser = await service.createUser(user);
//     if (!newUser) throw new Error("Validation Error!");
//     else
//       res.json({
//         data: newUser,
//       });
//   } catch (error) {
//     next(error);
//   }
// };

// export const update = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { name, description, price, stock } = req.body;

//     let item = await getByIdUser(id);

//     if (!item) throw new Error("User not found!");

//     const userUpdated = await service.updateUser(id, {
//       name,
//       description,
//       price,
//       stock,
//     });

//     res.json({
//       msg: "User updated",
//       data: userUpdated,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const remove = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     await service.deleteUser(id);

//     res.json({
//       msg: "User deleted",
//     });
//   } catch (error) {
//     next(error);
//   }
// };


// import * as service from "../services/user.services.js";

// export const getById = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const item = await service.getByIdUser(id);
//     if (!item) throw new Error("User not found!");
//     res.json(item);
//   } catch (error) {
//     next(error);
//   }
// };

// export const getByEmail = async (req, res, next) => {
//   try {
//     const { email } = req.params;
//     const item = await service.getByEmailUser(email);
//     if (!item) throw new Error("User not found!");
//     res.json(item);
//   } catch (error) {
//     next(error);
//   }
// };

// export const getAll = async (req, res, next) => {
//   try {
//     const { page, limit } = req.query;
//     const response = await service.getAllUsers(page, limit);
//     const nextLink = response.hasNextPage ? `/users/all?page=${response.nextPage}` : null;
//     const prevLink = response.hasPrevPage ? `/users/all?page=${response.prevPage}` : null;
//     res.json({
//       data: response.docs,
//       pageInfo: {
//         totalItems: response.totalDocs,
//         totalPages: response.totalPages,
//         nextPage: nextLink,
//         prevPage: prevLink
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const create = async (req, res, next) => {
//   try {
//     const user = { ...req.body };
//     const newUser = await service.createUser(user);
//     if (!newUser) throw new Error("Validation Error!");
//     res.json({
//       msg: "User created successfully",
//       data: newUser,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const update = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { name, description, price, stock } = req.body;

//     let item = await service.getByIdUser(id);
//     if (!item) throw new Error("User not found!");

//     const userUpdated = await service.updateUser(id, {
//       name,
//       description,
//       price,
//       stock,
//     });

//     res.json({
//       msg: "User updated successfully",
//       data: userUpdated,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const remove = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     await service.deleteUser(id);
//     res.json({
//       msg: "User deleted successfully",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

//product.dao.js prueba

// import { ProductModel } from "./models/product.model.js";

// export default class ProductDaoMongoDB {
//   async getAll(page = 1, limit = 10, name, sort) {
//     try {
//       const filter = name ? { 'name': name }: {category: category}; {}; //buscamos por name, si no devuelve el array con todos los productos
//       let sortOrder = {};
//       if(sort) sortOrder.price = sort === 'asc' ? 1 : sort === 'desc' ? -1 : null; // aca ordenamos por precio 
//       //{price: 1}
//       const response = await ProductModel.paginate(filter, { page, limit, sort: sortOrder, category }); // respetar el orden que pusimos aca en el service
//       return response;
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async getById(id) {
//     try {
//       const response = await ProductModel.findById(id);
//       return response;
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async create(obj) {
//     try {
//       const response = await ProductModel.create(obj);
//       return response;
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async update(id, obj) {
//     try {
//       const response = await ProductModel.findByIdAndUpdate(id, obj, {
//         new: true,
//       });
//       return response;
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async delete(id) {
//     try {
//       const response = await ProductModel.findByIdAndDelete(id);
//       return response;
//     } catch (error) {
//       console.log(error);
//     }
//   }
// }

//cart.routers
// import { Router } from "express";
// import CartManager from "../../managers/cart.manager.js";
// import { __dirname } from "../../utils.js";

// const router = Router();
// const cartManager = new CartManager(`${__dirname}/db/carts.json`);

// // Ruta para agregar un producto al carrito
// router.post("/:idCart/product/:idProd", async (req, res, next) => {
//   try {
//     const { idProd, idCart } = req.params;
//     const response = await cartManager.saveProductToCart(idCart, idProd);
//     res.json(response);
//   } catch (error) {
//     next(error);
//   }
// });

// // Ruta para crear un nuevo carrito
// router.post("/", async (req, res) => {
//   try {
//     const newCart = await cartManager.createCart();
//     res.json(newCart);
//   } catch (error) {
//     res.status(500).json(error.message);
//   }
// });

// // Ruta para obtener un carrito por ID
// router.get("/:idCart", async (req, res) => {
//   try {
//     const { idCart } = req.params;
//     const cart = await cartManager.getCartById(idCart);
//     res.json(cart);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error.message);
//   }
// });

// // export default router;
// import { Router } from "express";
// //import * as controller from "../controllers/cart.controllers.js";
// //import * as controller from "../src/controllers/cart.controllers.js";
// import * as controller from "./controller/cart.controllers.js";

// const router = Router();

// // Obtener todos los carritos
// router.get("/", controller.getAll);

// // Obtener un carrito por ID
// router.get("/:id", controller.getById);

// // Crear un nuevo carrito
// router.post("/", controller.create);

// // Actualizar un carrito por ID
// router.put("/:id", controller.update);

// // Eliminar un carrito por ID
// router.delete("/:id", controller.remove);

// // Añadir un producto a un carrito específico
// router.post("/:idCart/products/:idProd", controller.addProdToCart);

// // Eliminar un producto de un carrito específico
// router.delete("/:idCart/products/:idProd", controller.removeProdToCart);

// // Actualizar la cantidad de un producto en un carrito específico
// router.put("/:idCart/products/:idProd", controller.updateProdQuantityToCart);

// // Vaciar un carrito específico
// router.delete("/clear/:idCart", controller.clearCart);

// export default router;

//router.product

// import { Router } from "express";
// const router = Router();

// import { __dirname } from "../../utils.js";

// import ProductManager from "../../managers/product.manager.js";
// const productManager = new ProductManager(`${__dirname}/db/products.json`);

// import {productValidator} from '../../middlewares/productValidator.js'

// router.get('/', async(req, res) => {
//     try {
//         const { limit } = req.query;
//         console.log(limit);
//         const products = await productManager.getProducts(limit);
//         res.status(200).json(products);
//     } catch (error) {
//         res.status(404).json({ message: error.message });
//         console.log(error);
//     }
// });

// router.get("/:idProd", async (req, res) => {
//     try {
//       const { idProd } = req.params;
//       const product = await productManager.getProductById(idProd);
//       if (!product) res.status(404).json({ msg: "product not found" });
//       else res.status(200).json(product);
//     } catch (error) {
//       res.status(500).json({ msg: error.message });
//     }
//   });


// router.post('/', productValidator, async (req, res)=>{     // aca le agrego el validador de productos que viene del middleware

//     try {
//         console.log(req.body.description);
//         const product = req.body;
//         const newProduct = await productManager.createProduct(product);
//         res.json(newProduct);
//     } catch (error) {
//         res.status(404).json({ message: error.message });
//     }
// });

// router.put("/:idProd", async (req, res) => {
//     try {
//       const { idProd } = req.params;
//       const prodUpd = await productManager.updateProduct(req.body, idProd);
//       if (!prodUpd) res.status(404).json({ msg: "Error updating prod" });
//       res.status(200).json(prodUpd);
//     } catch (error) {
//       res.status(500).json({ msg: error.message });
//     }
//   });

// router.delete("/:idProd", async (req, res) => {
//     try {
//       const { idProd } = req.params;
//       const delProd = await productManager.deleteProduct(idProd);
//       if(!delProd) res.status(404).json({ msg: "Error delete product" });
//       else res.status(200).json({msg : `product id: ${idProd} deleted successfully`})
//     } catch (error) {
//       res.status(500).json({ msg: error.message });
//     }
//   });

// router.delete('/', async(req, res)=>{
//     try {
//         await productManager.deleteFile();
//         res.send('products deleted successfully')
//     } catch (error) {
//         res.status(404).json({ message: error.message });

//     }
// });

// export default router;

//user router
// import { Router } from 'express';
// import * as controller from '../controllers/users.controllers.js';
//colocar todo lo de users revisar...
// const router = Router();

// // Rutas para manejar archivos
// //router.post('/file', controller.createFileCtr);
//  router.post('/', controller.createCtr);
// // Ruta para crear un usuario
// router.post('/', controller.createCtr);

// // Rutas para obtener todos los usuarios
// router.get('/all', controller.getAllCtr);

// // Ruta para buscar por nombre
// router.get('/name/:name', controller.getByNameCtr);

// // Ruta para obtener un usuario por ID
// router.get('/:id', controller.getByIdCtr);

// // Ruta alternativa para obtener un usuario por ID
// router.get('/id/:id', controller.getByIdCtr);

// // Ruta para buscar por email
// router.get('/email/:email', controller.getByEmailCtr);

// // Ruta para actualizar un usuario por ID
// router.put('/:id', controller.updateCtr);

// // Ruta alternativa para actualizar un usuario (ejemplo de otro controlador)
// router.put('/update/:id', controller.update);

// // Ruta para eliminar un usuario por ID
// router.delete('/:id', controller.deleteCtr);

// // Ruta alternativa para eliminar un usuario (ejemplo de otro controlador)
// router.delete('/remove/:id', controller.remove);

// export default router;
//string de coneccion en conexion.js

// import mongoose from "mongoose";

// const conectionString = "mongodb+srv://admin:admin@cluster0.kou88d2.mongodb.net/mydatabase?retryWrites=true&w=majority";

// const initMongoDB = async () => {
//     try {
//         await mongoose.connect(conectionString);
//         console.log("MongoDB connected");   
//     } catch (error) {
//         console.log(error);
//     }
        
//     }

//     initMongoDB(); 
    
    //export default mongoose;    

//     import mongoose from "mongoose";

// // Asegúrate de reemplazar 'admin' con la contraseña real si 'admin' no es tu contraseña
// const connectionString = "mongodb+srv://admin:admin@cluster0.kou88d2.mongodb.net/mydatabase?retryWrites=true&w=majority";

// const initMongoDB = async () => {
//     try {
//         await mongoose.connect(connectionString, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log("MongoDB connected");   
//     } catch (error) {
//         console.error("Error connecting to MongoDB:", error);
//     }
// }

// initMongoDB();

// Si deseas exportar mongoose para usarlo en otros módulos, descomenta la línea siguiente
// export default mongoose;


// products.router.js version 2

// import { Router } from "express";
// import * as controller from "../../../src/controllers/product.controllers.js";

// const router = Router();

// router.get("/", controller.getAll);
// router.get("/:id", controller.getById);
// router.post("/", controller.create);
// router.put("/:id", controller.update);
// router.delete("/:id", controller.remove);
// router.post("/:idCart/products/:idProd", controller.addProdToCart);
// router.delete("/:idCart/products/:idProd", controller.removeProdToCart);
// router.put("/:idCart/products/:idProd", controller.updateProdQuantityToCart);
// router.delete("/clear/:idCart", controller.clearCart);

// export default router;


//este server rompio todo


// import express from 'express';
// import handlebars from 'express-handlebars';
// import { Server } from 'socket.io';
// import morgan from 'morgan';

// import { initMongoDB } from './db/database.js';


// import ProductsManager from './managers/product.manager.js';
// import CartManager from './managers/cart.manager.js';
// import MessageManager from './managers/messages.manager.js';

// import viewsRouter from './routes/views.router.js';
// import productsRouter from './routes/api/products.router.js';
// import userRouter from './routes/users.router.js';
// import cartRouter from './routes/api/cart.router.js';

// import { fileURLToPath } from 'url';
// import path from 'path';

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

// const app = express();
// const PORT = process.env.PORT || 8080;

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(morgan('dev'));

// // Configura el motor de plantillas Handlebars
// app.engine('handlebars', handlebars());
// app.set('view engine', 'handlebars');
// app.set('views', path.join(__dirname, 'views'));

// // Inicializa la conexión a MongoDB
// initMongoDB();

// // Inicializa ProductManager, CartManager y MessageManager
// const productManager = new ProductsManager(path.join(__dirname, 'db/products.json'));
// const cartManager = new CartManager(path.join(__dirname, 'db/carts.json'));
// const messageManager = new MessageManager(path.join(__dirname, 'db/messages.json'));

// // Rutas
// app.use('/products', productsRouter);
// app.use('/api/products', productsRouter);
// app.use('/users', userRouter);
// app.use('/api/carts', cartRouter);
// app.use('/', viewsRouter);
// app.use('/chat', viewsRouter);
// app.use('/realTimeProducts', viewsRouter);
// app.use('/vista1', viewsRouter);
// app.use('/vista2', viewsRouter);
// app.use('/websocket', viewsRouter);

// // Manejo de errores
// app.use(errorHandler);

// // Configura el servidor HTTP y Socket.io
// const httpServer = app.listen(PORT, () => {
//   console.log(`🚀 Server listening on port ${PORT}`);
// });

// const socketServer = new Server(httpServer);

// socketServer.on('connection', async (socket) => {
//   console.log('🟢 ¡New connection!', socket.id);

//   // Emitir productos actuales a los clientes
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
//     // Lógica para eliminar el producto del carrito
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

// // Define rutas adicionales
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



//cart.router.js



// // import { Router } from "express";
// import * as controller from "../controllers/cart.controllers.js";

// const router = Router();

// router.get("/", controller.getAll);

// router.get("/:id", controller.getById);

// router.post("/", controller.create);

// router.put("/:id", controller.update);

// router.delete("/:id", controller.remove);

// router.post("/:idCart/products/:idProd", controller.addProdToCart);

// router.delete("/:idCart/products/:idProd", controller.removeProdToCart);

// router.put("/:idCart/products/:idProd", controller.updateProdQuantityToCart);

// router.delete("/clear/:idCart", controller.clearCart);

// export default router;


// import { Router } from "express";
// import CartManager from "../../managers/cart.manager.js";
// import { __dirname } from "../../utils.js";

// const router = Router();
// const cartManager = new CartManager(`${__dirname}/db/carts.json`);

// // Ruta para agregar un producto al carrito
// router.post("/:idCart/product/:idProd", async (req, res, next) => {
//   try {
//     const { idProd, idCart } = req.params;
//     const response = await cartManager.saveProductToCart(idCart, idProd);
//     res.json(response);
//   } catch (error) {
//     next(error);
//   }
// });

// // Ruta para crear un nuevo carrito
// router.post("/", async (req, res) => {
//   try {
//     const newCart = await cartManager.createCart();
//     res.json(newCart);
//   } catch (error) {
//     res.status(500).json(error.message);
//   }
// });

// // Ruta para obtener un carrito por ID
// router.get("/:idCart", async (req, res) => {
//   try {
//     const { idCart } = req.params;
//     const cart = await cartManager.getCartById(idCart);
//     res.json(cart);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error.message);
//   }
// });


//cart.router

// router.post("/", async (req, res) => {
//     try {
//       const newCart = await cartManager.createCart();
//       res.json(newCart);
//     } catch (error) {
//       res.status(500).json(error.message);
//     }
//   });
  
//   // Ruta para obtener un carrito por ID
//   router.get("/:idCart", async (req, res) => {
//     try {
//       const { idCart } = req.params;
//       const cart = await cartManager.getCartById(idCart);
//       res.json(cart);
//     } catch (error) {
//       console.log(error);
//       res.status(500).json(error.message);
//     }
//   });


//cartrouter.js por fuera



// // // export default router;
// import { Router } from "express";
// //import * as controller from "../controllers/cart.controllers.js";
// //import * as controller from "../src/controllers/cart.controllers.js";
// //import * as controller from "./controller/cart.controllers.js";
// import * as controller from "../controllers/cart.controllers.js";

// const router = Router();

// // Obtener todos los carritos
// router.get("/", controller.getAll);

// // Obtener un carrito por ID
// router.get("/:id", controller.getById);

// // Crear un nuevo carrito
// router.post("/", controller.create);

// // Actualizar un carrito por ID
// router.put("/:id", controller.update);

// // Eliminar un carrito por ID
// router.delete("/:id", controller.remove);

// // Añadir un producto a un carrito específico
// router.post("/:idCart/products/:idProd", controller.addProdToCart);

// // Eliminar un producto de un carrito específico
// router.delete("/:idCart/products/:idProd", controller.removeProdToCart);

// // Actualizar la cantidad de un producto en un carrito específico
// router.put("/:idCart/products/:idProd", controller.updateProdQuantityToCart);

// // Vaciar un carrito específico
// router.delete("/clear/:idCart", controller.clearCart);


// const cartManager = new CartManager(`${__dirname}/db/carts.json`);

// //Ruta para agregar un producto al carrito
// router.post("/:idCart/product/:idProd", async (req, res, next) => {
//   try {
//     const { idProd, idCart } = req.params;
//     const response = await cartManager.saveProductToCart(idCart, idProd);
//     res.json(response);
//   } catch (error) {
//     next(error);
//   }
// });

// // Ruta para crear un nuevo carrito
//export default router;


//product.router prueba



// import { Router } from "express";
// import * as controller from "../../../src/controllers/product.controllers.js";

// const router = Router();

// import { __dirname } from "../../utils.js";

// import ProductManager from "../../managers/product.manager.js";
// const productManager = new ProductManager(`${__dirname}/db/products.json`);

// import CartManager from "../../managers/cart.manager.js"; // Asegúrate de importar CartManager
// const cartManager = new CartManager(`${__dirname}/db/carts.json`);

// import { productValidator } from '../../middlewares/productValidator.js';

// router.get('/', async (req, res) => {
//     try {
//         const { limit } = req.query;
//         console.log(limit);
//         const products = await productManager.getProducts(limit);
//         res.status(200).json(products);
//     } catch (error) {
//         res.status(404).json({ message: error.message });
//         console.log(error);
//     }
// });

// router.get("/:idProd", async (req, res) => {
//     try {
//         const { idProd } = req.params;
//         const product = await productManager.getProductById(idProd);
//         if (!product) res.status(404).json({ msg: "product not found" });
//         else res.status(200).json(product);
//     } catch (error) {
//         res.status(500).json({ msg: error.message });
//     }
// });

// router.post('/', productValidator, async (req, res) => { // Agregar el validador de productos que viene del middleware
//     try {
//         console.log(req.body.description);
//         const product = req.body;
//         const newProduct = await productManager.createProduct(product);
//         res.json(newProduct);
//     } catch (error) {
//         res.status(404).json({ message: error.message });
//     }
// });

// router.put("/:idProd", async (req, res) => {
//     try {
//         const { idProd } = req.params;
//         const prodUpd = await productManager.updateProduct(req.body, idProd);
//         if (!prodUpd) res.status(404).json({ msg: "Error updating prod" });
//         res.status(200).json(prodUpd);
//     } catch (error) {
//         res.status(500).json({ msg: error.message });
//     }
// });

// router.delete("/:idProd", async (req, res) => {
//     try {
//         const { idProd } = req.params;
//         const delProd = await productManager.deleteProduct(idProd);
//         if (!delProd) res.status(404).json({ msg: "Error delete product" });
//         else res.status(200).json({ msg: `product id: ${idProd} deleted successfully` });
//     } catch (error) {
//         res.status(500).json({ msg: error.message });
//     }
// });

// router.delete('/', async (req, res) => {
//     try {
//         await productManager.deleteFile();
//         res.send('products deleted successfully');
//     } catch (error) {
//         res.status(404).json({ message: error.message });
//     }
// });

// // Ruta para agregar un producto al carrito
// router.post("/:idCart/product/:idProd", async (req, res, next) => {
//     try {
//         const { idProd, idCart } = req.params;
//         const response = await cartManager.saveProductToCart(idCart, idProd);
//         res.json(response);
//     } catch (error) {
//         next(error);
//     }
// });

// export default router;


//cart.dao


// import { CartModel } from "./models/cart.model.js";

// export default class CartDaoMongoDB {
//   async create() {
//     try {
//       return await CartModel.create({
//         products: [],
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async getAll() {
//     try {
//       return await CartModel.find({});
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async getById(id) {
//     try {
//       return await CartModel.findById(id).populate("products.product"); // devuelve la info completa del producto con populate
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async delete(id) {
//     try {
//       return await CartModel.findByIdAndDelete(id);
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async existProdInCart(cartId, prodId){
//     try {
//       return await CartModel.findOne({
//         _id: cartId,
//         products: { $elemMatch: { product: prodId } }
//       });
//       //return await CartModel.findOne(
//         //{ _id: cartId, 'products.product': prodId }
//       // )
//     } catch (error) {
//       throw new Error(error);
//     }
//   }

//   async addProdToCart(cartId, prodId, quantity) {
//     try {
//       const existProdInCart = await this.existProdInCart(cartId, prodId);
//         if(existProdInCart){
//           return await CartModel.findOneAndUpdate(
//             { _id: cartId, 'products.product': prodId },
//             { $set: { 'products.$.quantity': existProdInCart.products[0].quantity + 1 } },
//             { new: true }
//           );
//         } else {
//           return await CartModel.findByIdAndUpdate(
//             cartId,
//             { $push: { products: { product: prodId, quantity } } },
//             { new: true } // array del producto con el carrito
//           )
//         }
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async removeProdToCart(cartId, prodId) {
//     try {
//       return await CartModel.findByIdAndUpdate(
//         { _id: cartId },
//         { $pull: { products: { product: prodId } } },
//         { new: true }
//       )
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async update(id, obj) {
//     try {
//       const response = await CartModel.findByIdAndUpdate(id, obj, {
//         new: true,
//       });
//       return response;
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async updateProdQuantityToCart(cartId, prodId, quantity) {
//     try {
//       return await CartModel.findOneAndUpdate(
//         { _id: cartId, 'products.product': prodId },
//         { $set: { 'products.$.quantity': quantity } },
//         { new: true }
//       );
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async clearCart(cartId) {
//     try {
//      return await CartModel.findOneAndUpdate(
//       { _id: cartId },
//       { $set: { products: [] } },
//       { new: true }
//      )
//     } catch (error) {
//       console.log(error);
//     }
//   }
// }


//product.dao prueba

// import { ProductModel } from "./models/product.model.js";

// export default class ProductDaoMongoDB {

//   // Obtener todos los productos con paginación, filtrado y ordenación
//   async getAll(page = 1, limit = 10, name, category, sort) {
//     try {
//       // Definir el filtro
//       const filter = {};
//       if (name) filter.name = name;
//       if (category) filter.category = category;

//       // Definir el orden de clasificación
//       const sortOrder = {};
//       if (sort) sortOrder.price = sort === 'asc' ? 1 : -1;

//       const response = await ProductModel.paginate(filter, { page, limit, sort: sortOrder });
//       return response;
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       throw new Error('Error fetching products');
//     }
//   }

//   // Obtener un producto por su ID
//   async getById(id) {
//     try {
//       const response = await ProductModel.findById(id);
//       return response;
//     } catch (error) {
//       console.error('Error fetching product by ID:', error);
//       throw new Error('Error fetching product by ID');
//     }
//   }

//   // Crear un nuevo producto
//   async create(obj) {
//     try {
//       const response = await ProductModel.create(obj);
//       return response;
//     } catch (error) {
//       console.error('Error creating product:', error);
//       throw new Error('Error creating product');
//     }
//   }

//   // Actualizar un producto por su ID
//   async update(id, obj) {
//     try {
//       const response = await ProductModel.findByIdAndUpdate(id, obj, { new: true });
//       return response;
//     } catch (error) {
//       console.error('Error updating product:', error);
//       throw new Error('Error updating product');
//     }
//   }

//   // Eliminar un producto por su ID
//   async delete(id) {
//     try {
//       const response = await ProductModel.findByIdAndDelete(id);
//       return response;
//     } catch (error) {
//       console.error('Error deleting product:', error);
//       throw new Error('Error deleting product');
//     }
//   }
// }

//porduct.controllers


// import * as service from "../services/product.services.js";

// export const getAll = async (req, res, next) => {
//   try {
//     const { page = 1, limit = 10, title, sort, category } = req.query; // Valores predeterminados para paginación
//     const response = await service.getAll(page, limit, title, sort, category);

//     // Construir los enlaces de paginación
//     const baseUrl = `http://localhost:8080/products`;
//     const buildLink = (page) => {
//       let url = `${baseUrl}?page=${page}`;
//       if (limit) url += `&limit=${limit}`;
//       if (title) url += `&title=${title}`;
//       if (sort) url += `&sort=${sort}`;
//       if (category) url += `&category=${category}`;
//       return url;
//     };
    
//     const nextLink = response.hasNextPage ? buildLink(response.nextPage) : null;
//     const prevLink = response.hasPrevPage ? buildLink(response.prevPage) : null;

//     res.status(200).json({
//       status: 'success',
//       payload: response.docs,
//       totalDocs: response.totalDocs,
//       totalPages: response.totalPages,
//       page: response.page,
//       hasNextPage: response.hasNextPage,
//       hasPrevPage: response.hasPrevPage,
//       prevPage: response.prevPage,
//       nextPage: response.nextPage,
//       prevLink,
//       nextLink
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const getById = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const response = await service.getById(id);
//     if (!response) return res.status(404).json({ msg: "Product not found!" });
//     res.status(200).json(response);
//   } catch (error) {
//     next(error);
//   }
// };

// export const create = async (req, res, next) => {
//   try {
//     const newProd = await service.create(req.body);
//     if (!newProd) return res.status(400).json({ msg: "Error creating product!" });
//     res.status(201).json(newProd); // Cambiar a 201 para creación exitosa
//   } catch (error) {
//     next(error);
//   }
// };

// export const update = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const prodUpd = await service.update(id, req.body);
//     if (!prodUpd) return res.status(400).json({ msg: "Error updating product!" });
//     res.status(200).json(prodUpd);
//   } catch (error) {
//     next(error);
//   }
// };

// export const remove = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const prodDel = await service.remove(id);
//     if (!prodDel) return res.status(400).json({ msg: "Error deleting product!" });
//     res.status(200).json({ msg: `Product id: ${id} deleted` });
//   } catch (error) {
//     next(error);
//   }
// };


//no se que es ya estoy mareada me andaba el paginate y ahora no LPM!!!

// import { Router } from "express";
// // import * as controller from "../../../src/controllers/product.controllers.js";
// import * as controller from "../../controllers/product.controllers.js";

// const router = Router();

// import { __dirname } from "../../utils.js";

// import ProductManager from "../../managers/product.manager.js";
// const productManager = new ProductManager(`${__dirname}/db/products.json`);

// import CartManager from "../../managers/cart.manager.js"; // Importar CartManager
// const cartManager = new CartManager(`${__dirname}/db/carts.json`);


// import {productValidator} from '../../middlewares/productValidator.js'

// router.get('/', async(req, res) => {
//     try {
//         const { limit } = req.query;
//         console.log(limit);
//         const products = await productManager.getProducts(limit);
//         res.status(200).json(products);
//     } catch (error) {
//         res.status(404).json({ message: error.message });
//         console.log(error);
//     }
// });

// router.get("/:idProd", async (req, res) => {
//     try {
//       const { idProd } = req.params;
//       const product = await productManager.getProductById(idProd);
//       if (!product) res.status(404).json({ msg: "product not found" });
//       else res.status(200).json(product);
//     } catch (error) {
//       res.status(500).json({ msg: error.message });
//     }
//   });


// router.post('/', productValidator, async (req, res)=>{     // aca le agrego el validador de productos que viene del middleware

//     try {
//         console.log(req.body.description);
//         const product = req.body;
//         const newProduct = await productManager.createProduct(product);
//         res.json(newProduct);
//     } catch (error) {
//         res.status(404).json({ message: error.message });
//     }
// });

// router.put("/:idProd", async (req, res) => {
//     try {
//       const { idProd } = req.params;
//       const prodUpd = await productManager.updateProduct(req.body, idProd);
//       if (!prodUpd) res.status(404).json({ msg: "Error updating prod" });
//       res.status(200).json(prodUpd);
//     } catch (error) {
//       res.status(500).json({ msg: error.message });
//     }
//   });

// router.delete("/:idProd", async (req, res) => {
//     try {
//       const { idProd } = req.params;
//       const delProd = await productManager.deleteProduct(idProd);
//       if(!delProd) res.status(404).json({ msg: "Error delete product" });
//       else res.status(200).json({msg : `product id: ${idProd} deleted successfully`})
//     } catch (error) {
//       res.status(500).json({ msg: error.message });
//     }
//   });

// router.delete('/', async(req, res)=>{
//     try {
//         await productManager.deleteFile();
//         res.send('products deleted successfully')
//     } catch (error) {
//         res.status(404).json({ message: error.message });

//     }
// });



// //Ruta para agregar un producto al carrito
// router.post("/:idCart/product/:idProd", async (req, res, next) => {
//   try {
//     const { idProd, idCart } = req.params;
//     const response = await cartManager.saveProductToCart(idCart, idProd);
//     res.json(response);
//   } catch (error) {
//     next(error);
//   }
// });

// export default router;




//server .js



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