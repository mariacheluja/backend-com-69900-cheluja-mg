import { Router } from "express";
import * as controller from "../../controllers/cart.controllers.js";

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

export default router;
