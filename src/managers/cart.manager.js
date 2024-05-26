
// // Importaciones necesarias
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

// Importaciones necesarias
import { __dirname } from "../utils.js";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import ProductManager from "./product.manager.js";

const productManager = new ProductManager(`${__dirname}/db/products.json`); // Apunto a la DB de productos

export default class CartManager {
  constructor(path) {
    this.path = path;
  }

  // Función para obtener todos los carritos
  async getAllCarts() {
    try {
      if (fs.existsSync(this.path)) {
        const carts = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(carts);
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  // Función para crear un nuevo carrito
  async createCart() {
    try {
      const cart = {
        id: uuidv4(),
        products: [],  // Array vacío al crear un nuevo carrito
      };
      const carts = await this.getAllCarts();
      carts.push(cart);
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
      return cart;
    } catch (error) {
      console.log(error);
    }
  }

  // Función para obtener un carrito por ID
  async getCartById(id) {
    try {
      const carts = await this.getAllCarts();
      const cart = carts.find((c) => c.id === id);
      if (!cart) {
        console.log('No se encontró ningún carrito con el ID proporcionado.');
        return null;
      }
      return cart;
    } catch (error) {
      console.log(error);
    }
  }

  // Función para agregar un producto al carrito
  async saveProductToCart(idCart, idProduct) {
    try {
      const cartExist = await this.getCartById(idCart);
      if (!cartExist) throw new Error('Cart not found');
      
      // Verificar si el producto ya existe en el carrito
      const existProdInCart = cartExist.products.find((prod) => prod.product === idProduct);
      if (!existProdInCart) {
        // Si no existe, añadirlo con cantidad 1
        const prod = {
          product: idProduct,
          quantity: 1
        };
        cartExist.products.push(prod);
      } else {
        // Si ya existe, incrementar la cantidad
        existProdInCart.quantity += 1;
      }

      // Obtener todos los carritos y actualizar el carrito modificado
      const carts = await this.getAllCarts();
      const updatedCarts = carts.map((cart) => cart.id === idCart ? cartExist : cart);
      
      // Guardar los carritos actualizados
      await fs.promises.writeFile(this.path, JSON.stringify(updatedCarts, null, 2));
      return cartExist;
    } catch (err) {
      console.log(err);
    }
  }
}
