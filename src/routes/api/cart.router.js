import { Router } from "express";
import * as controller from "../../controllers/cart.controllers.js";

import { cartModel } from "../models/cart.model.js";
import { productModel } from "../models/product.model.js";
import { validate } from "../middlewares/validation.middleware.js";
import { cartDto } from "../dtos/cart.dto.js";
import { v4 as uuidv4 } from "uuid"; 

const router = Router();

// Obtener todos los carritos
router.get("/", controller.getAll);

// Obtener un carrito por su ID
router.get("/:id", controller.getById);

// Crear un nuevo carrito
router.post("/", controller.create);

// Actualizar un carrito por su ID
router.put("/:id", controller.update);

// Eliminar un carrito por su ID
router.delete("/:id", controller.remove);

// Añadir un producto a un carrito
router.post("/:idCart/products/:idProd", controller.addProdToCart);

// Eliminar un producto de un carrito
router.delete("/:idCart/products/:idProd", controller.removeProdToCart);

// Actualizar la cantidad de un producto en un carrito
router.put("/:idCart/products/:idProd", controller.updateProdQuantityToCart);

// Vaciar un carrito por su ID
router.delete("/clear/:idCart", controller.clearCart);

// **Eliminé rutas duplicadas para obtener carritos y crear carritos**

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await cartModel.findById(id);
    res.json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener el carrito", details: error.message });
  }
});

router.post("/", validate(cartDto), async (req, res) => {
  try {
    const { products } = req.body;
    const cart = await cartModel.create({ products });
    res.status(201).json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al crear el carrito", details: error.message });
  }
});

router.post("/:id/products", async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const productExists = await productModel.findById(productId);

    if (!productExists) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    const cart = await cartModel.findById(req.params.id);

    const isProductInCart = cart.products.find((p) => p.product.equals(productId)); // Uso `equals` para comparar ObjectId

    if (isProductInCart) {
      isProductInCart.quantity += quantity; // Actualiza la cantidad

      await cart.save(); 

      res.json(cart);
    } else {
      cart.products.push({
        product: productId,
        quantity,
      });

      await cart.save(); 

      res.json(cart);
    }
  } catch (error) {
    res.status(500).json({
      error: "Error al agregar producto al carrito",
      details: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await cartModel.findByIdAndDelete(id);

    res.json(cart);
  } catch (error) {
    res.status(500).json({
      error: "Error al eliminar el carrito",
      details: error.message,
    });
  }
});

router.delete("/:id/products/:productId", async (req, res) => {
  try {
    const { id, productId } = req.params;
    const cart = await cartModel.findById(id);

    const isProductInCart = cart.products.find((p) => p.product.equals(productId)); // Uso `equals` para comparar ObjectId correctamente

    if (isProductInCart) {
      cart.products = cart.products.filter((p) => !p.product.equals(productId)); // Uso `equals` para comparar ObjectId correctamente
      await cart.save(); 

      res.json(cart);
    } else {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Error al eliminar el producto del carrito",
      details: error.message,
    });
  }
});

router.delete("/:id/products", async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await cartModel.findById(id);

    cart.products = [];
    await cart.save(); // `await` para guardar el carrito correctamente

    res.json(cart);
  } catch (error) {
    res.status(500).json({
      error: "Error al eliminar todos los productos del carrito",
      details: error.message,
    });
  }
});

// Corrijo la entrega final para finalizar compra, a ver si funciona
router.post("/:id/purchase", async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await cartModel.findById(id).populate("products.product");

    if (!cart) {
      return res.status(404).json({
        error: "No se encontró el carrito",
      });
    }

    const productsWithoutStock = [];

    cart.products.forEach((p) => {
      if (p.product.stock < p.quantity) { 
        productsWithoutStock.push(p);
      }
    });

    if (productsWithoutStock.length) {
      return res.status(400).json({
        error: "Algunos productos no tienen stock suficiente",
        productsWithoutStock,
      });
    }

    // Descontar stock del producto
    cart.products.forEach(async (p) => {
      p.product.stock -= p.quantity;
      await p.product.save(); // `await` para guardar el producto correctamente
    });

    const ticket = await ticketModel.create({
      code: uuidv4(), // Genero el ticket y generar el UUID
      purchase_datetime: new Date(),
      amount: cart.products.reduce(
        (acc, curr) => acc + curr.quantity * curr.product.price,
        0
      ),
      purchaser: req.user._id,
    });

    res.status(200).json({
      message: "Compra finalizada",
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al finalizar la compra",
      details: error.message,
    });
  }
});

export default router;






// import { Router } from "express";
// import * as controller from "../../controllers/cart.controllers.js";

// import { cartModel } from "../models/cart.model.js";
// import { productModel } from "../models/product.model.js";
// import { validate } from "../middlewares/validation.middleware.js";
// import { cartDto } from "../dtos/cart.dto.js";
// import { uuid } from "uuidv4";


// const router = Router();

// // Obtener todos los carritos
// router.get("/", controller.getAll);

// // Obtener un carrito por su ID
// router.get("/:id", controller.getById);

// // Crear un nuevo carrito
// router.post("/", controller.create);

// // Actualizar un carrito por su ID
// router.put("/:id", controller.update);

// // Eliminar un carrito por su ID
// router.delete("/:id", controller.remove);

// // Añadir un producto a un carrito
// router.post("/:idCart/products/:idProd", controller.addProdToCart);

// // Eliminar un producto de un carrito
// router.delete("/:idCart/products/:idProd", controller.removeProdToCart);

// // Actualizar la cantidad de un producto en un carrito
// router.put("/:idCart/products/:idProd", controller.updateProdQuantityToCart);

// // Vaciar un carrito por su ID
// router.delete("/clear/:idCart", controller.clearCart);

// router.get("/:id", async (req, res) => {
//     try {
//       const { id } = req.params;
//       const cart = await cartModel.findById(id);
//       res.json(cart);
//     } catch (error) {
//       res
//         .status(500)
//         .json({ error: "Error al obtener el carrito", details: error.message });
//     }
//   });
//   router.post("/", validate(cartDto), async (req, res) => {
//     try {
//       const { products } = req.body;
//       const cart = await cartModel.create({ products });
//       res.status(201).json(cart);
//     } catch (error) {
//       res
//         .status(500)
//         .json({ error: "Error al crear el carrito", details: error.message });
//     }
//   });
//   router.post("/:id/products", async (req, res) => {
//     try {
//       const { productId, quantity } = req.body;
  
//       const productExists = await productModel.findById(productId);
  
//       if (!productExists) {
//         return res.status(404).json({
//           error: "Producto no encontrado",
//         });
//       }
  
//       const cart = await cartModel.findById(req.params.id);
  
//       const isProductInCart = cart.products.find((p) => p.product === productId);
  
//       if (isProductInCart) {
//         cart.products.find((p) => p.product === productId).quantity += quantity;
  
//         cart.save();
  
//         res.json(cart);
//       } else {
//         cart.products.push({
//           product: productId,
//           quantity,
//         });
  
//         cart.save();
  
//         res.json(cart);
//       }
//     } catch (error) {
//       res.status(500).json({
//         error: "Error al agregar producto al carrito",
//         details: error.message,
//       });
//     }
//   });
  
//   router.delete("/:id", async (req, res) => {
//     try {
//       const { id } = req.params;
//       const cart = await cartModel.findByIdAndDelete(id);
  
//       res.json(cart);
//     } catch (error) {
//       res.status(500).json({
//         error: "Error al eliminar el carrito",
//         details: error.message,
//       });
//     }
//   });
  
//   router.delete("/:id/products/:productId", async (req, res) => {
//     try {
//       const { id, productId } = req.params;
//       const cart = await cartModel.findById(id);
  
//       const isProductInCart = cart.products.find((p) => p.product === productId);
  
//       if (isProductInCart) {
//         cart.products = cart.products.filter((p) => p.product !== productId);
//         cart.save();
  
//         res.json(cart);
//       } else {
//         return res.status(404).json({
//           error: "Producto no encontrado",
//         });
//       }
//     } catch (error) {
//       res.status(500).json({
//         error: "Error al eliminar el producto del carrito",
//         details: error.message,
//       });
//     }
//   });
  
//   router.delete("/:id/products", async (req, res) => {
//     try {
//       const { id } = req.params;
//       const cart = await cartModel.findById(id);
  
//       cart.products = [];
//       cart.save();
  
//       res.json(cart);
//     } catch (error) {
//       res.status(500).json({
//         error: "Error al eliminar todos los productos del carrito",
//         details: error.message,
//       });
//     }
//   });
  
//   // Entrega final
//   router.post("/:id/purchase", async (req, res) => {
//     try {
//       const { id } = req.params;
  
//       const cart = await cartModel.findById(id).populate("products.product");
  
//       if (!cart) {
//         return res.status(404).json({
//           error: "No se encontró el carrito",
//         });
//       }
  
//       // Validar que la cantidad de productos dentro del carrito sea menor o igual al stock del producto
//       const productsWithoutStock = [];
  
//       // cart.products.filter((p) => {
//       //   if (product.stock <= p.quantity) {
//       //     productsWithoutStock.push(p);
//       //   }
//       //   return product.stock <= p.quantity;
//       // });
  
//       cart.products.forEach((p) => {
//         if (product.stock <= p.quantity) {
//           throw new Error(
//             `El producto ${product.name} no tiene stock suficiente`
//           );
//         }
//       });
  
//       // Descontar stock del producto
  
//       const ticket = await ticketModel.create({
//         code: uuid(),
//         purchase_datetime: new Date(),
//         amount: cart.products.reduce(
//           (acc, curr) => acc + curr.quantity * curr.product.price,
//           0
//         ),
//         purchaser: req.user._id,
//       });
  
//       res.status(200).json({
//         message: "Compra finalizada",
//         ticket,
//       });
//     } catch (error) {
//       res.status(500).json({
//         error: "Error al finalizar la compra",
//         details: error.message,
//       });
//     }
//   });


// export default router;
