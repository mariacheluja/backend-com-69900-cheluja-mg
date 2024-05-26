import { Router } from "express";
import CartManager from "../../managers/cart.manager.js";
import { __dirname } from "../../utils.js";

const router = Router();
const cartManager = new CartManager(`${__dirname}/db/carts.json`);

// Ruta para agregar un producto al carrito
router.post("/:idCart/product/:idProd", async (req, res, next) => {
  try {
    const { idProd, idCart } = req.params;
    const response = await cartManager.saveProductToCart(idCart, idProd);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Ruta para crear un nuevo carrito
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.json(newCart);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// Ruta para obtener un carrito por ID
router.get("/:idCart", async (req, res) => {
  try {
    const { idCart } = req.params;
    const cart = await cartManager.getCartById(idCart);
    res.json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
});

export default router;
