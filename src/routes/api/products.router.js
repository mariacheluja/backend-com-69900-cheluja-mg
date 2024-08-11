import { Router } from "express";
import * as controller from "../../../src/controllers/product.controllers.js";
import { productModel } from "../models/product.model.js";
import { validate } from "../middlewares/validation.middleware.js";
import { productDto } from "../dtos/product.dto.js";
import { authorizations } from "../middlewares/authorization.middleware.js";

const router = Router();

import { __dirname } from "../../utils.js";

import ProductManager from "../../managers/product.manager.js";
import CartManager from "../../managers/cart.manager.js"; // **Importa CartManager aquí**

const productManager = new ProductManager(`${__dirname}/db/products.json`);
const cartManager = new CartManager(`${__dirname}/db/carts.json`); // **Inicializa CartManager aquí**

import { productValidator } from '../../middlewares/productValidator.js'; // Importa el middleware `productValidator`

router.get('/', async (req, res) => {
    try {
        const { limit } = req.query;
        const products = await productManager.getProducts(limit);
        res.status(200).json(products);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.get("/:idProd", async (req, res) => {
    try {
        const { idProd } = req.params;
        const product = await productManager.getProductById(idProd);
        if (!product) res.status(404).json({ msg: "Product not found" });
        else res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

router.post('/', productValidator, async (req, res) => {
    try {
        const product = req.body;
        const newProduct = await productManager.createProduct(product);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// **Combina rutas POST duplicadas para manejar productos**
router.post(
    "/",
    authorizations(["admin"]),
    validate(productDto),
    productValidator, // Añade `productValidator` a la cadena de middlewares**
    async (req, res) => {
      try {
        const { name, description, price, image } = req.body;

        const newProduct = await productManager.createProduct({ // Usa `productManager.createProduct` en lugar de `productModel.create, probar.
          name,
          description,
          price,
          image,
        });

        res.status(201).json(newProduct);
      } catch (error) {
        res
          .status(500)
          .json({ error: "Error al crear el producto", details: error.message });
      }
    }
);

router.put("/:idProd", async (req, res) => {
    try {
        const { idProd } = req.params;
        const prodUpd = await productManager.updateProduct(req.body, idProd);
        if (!prodUpd) res.status(404).json({ msg: "Error updating product" });
        else res.status(200).json(prodUpd);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

router.delete("/:idProd", async (req, res) => {
    try {
        const { idProd } = req.params;
        const delProd = await productManager.deleteProduct(idProd);
        if (!delProd) res.status(404).json({ msg: "Error deleting product" });
        else res.status(200).json({ msg: `Product id: ${idProd} deleted successfully` });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

router.delete('/', async (req, res) => {
    try {
        await productManager.deleteFile();
        res.send('Products deleted successfully');
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Ruta para agregar un producto al carrito
router.post("/:idCart/product/:idProd", async (req, res) => {
    try {
        const { idProd, idCart } = req.params;
        const response = await cartManager.saveProductToCart(idCart, idProd);
        res.json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

export default router;




// // maneja el front y las peticiones HHTTP. el controller llama al service y el service al dao

// import { Router } from "express";
// import * as controller from "../../../src/controllers/product.controllers.js";
// //import * as controller from "../controllers/product.controllers.js";
// import { productModel } from "../models/product.model.js";
// import { validate } from "../middlewares/validation.middleware.js";
// import { productDto } from "../dtos/product.dto.js";
// import { authorizations } from "../middlewares/authorization.middleware.js";



// const router = Router();

// import { __dirname } from "../../utils.js";

// import ProductManager from "../../managers/product.manager.js";
// import CartManager from "../../managers/cart.manager.js"; // Import CartManager here

// const productManager = new ProductManager(`${__dirname}/db/products.json`);
// const cartManager = new CartManager(`${__dirname}/db/carts.json`); // Initialize CartManager here

// import { productValidator } from '../../middlewares/productValidator.js';

// router.get('/', async (req, res) => {
//     try {
//         const { limit } = req.query;
//         const products = await productManager.getProducts(limit);
//         res.status(200).json(products);
//     } catch (error) {
//         res.status(404).json({ message: error.message });
//     }
// });

// router.get("/:idProd", async (req, res) => {
//     try {
//         const { idProd } = req.params;
//         const product = await productManager.getProductById(idProd);
//         if (!product) res.status(404).json({ msg: "Product not found" });
//         else res.status(200).json(product);
//     } catch (error) {
//         res.status(500).json({ msg: error.message });
//     }
// });

// router.post('/', productValidator, async (req, res) => {
//     try {
//         const product = req.body;
//         const newProduct = await productManager.createProduct(product);
//         res.status(201).json(newProduct);
//     } catch (error) {
//         res.status(404).json({ message: error.message });
//     }
// });

// router.post(
//     "/",
//     authorizations(["admin"]),
//     validate(productDto),
//     async (req, res) => {
//       try {
//         const { name, description, price, image } = req.body;
  
//         const product = await productModel.create({
//           name,
//           description,
//           price,
//           image,
//         });
  
//         res.status(201).json(product);
//       } catch (error) {
//         res
//           .status(500)
//           .json({ error: "Error al crear el producto", details: error.message });
//       }
//     }
//   );

// router.put("/:idProd", async (req, res) => {
//     try {
//         const { idProd } = req.params;
//         const prodUpd = await productManager.updateProduct(req.body, idProd);
//         if (!prodUpd) res.status(404).json({ msg: "Error updating product" });
//         else res.status(200).json(prodUpd);
//     } catch (error) {
//         res.status(500).json({ msg: error.message });
//     }
// });

// router.delete("/:idProd", async (req, res) => {
//     try {
//         const { idProd } = req.params;
//         const delProd = await productManager.deleteProduct(idProd);
//         if (!delProd) res.status(404).json({ msg: "Error deleting product" });
//         else res.status(200).json({ msg: `Product id: ${idProd} deleted successfully` });
//     } catch (error) {
//         res.status(500).json({ msg: error.message });
//     }
// });

// router.delete('/', async (req, res) => {
//     try {
//         await productManager.deleteFile();
//         res.send('Products deleted successfully');
//     } catch (error) {
//         res.status(404).json({ message: error.message });
//     }
// });

// // Route to add a product to the cart
// router.post("/:idCart/product/:idProd", async (req, res) => {
//     try {
//         const { idProd, idCart } = req.params;
//         const response = await cartManager.saveProductToCart(idCart, idProd);
//         res.json(response);
//     } catch (error) {
//         res.status(500).json({ msg: error.message });
//     }
// });

// export default router;
