
// tengo que tener todos los metodos CRUD

import { CartModel } from "./models/cart.model.js";

export default class CartDaoMongoDB {
  async create() {
    try {
      return await CartModel.create({
        products: [],
      });
    } catch (error) {
      console.error(error);
      throw new Error('Error creating cart');
    }
  }

  async getAll() {
    try {
      return await CartModel.find({});
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching all carts');
    }
  }

  // cuado busque un carrito por id va a aplicar el populate
  async getById(id) {
    try {
      return await CartModel.findById(id).populate("products.product"); // devuelve la info completa del producto con populate
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching cart by ID');
    }
  }

//ver falta esto
async create(cart) {
  try {
    return await CartModel.create(cart);
  } catch (error) {
    console.error(error);
    throw new Error('Error creating cart');
  }
}
  async delete(id) {
    try {
      return await CartModel.findByIdAndDelete(id);
    } catch (error) {
      console.error(error);
      throw new Error('Error deleting cart');
    }
  }

  async existProdInCart(cartId, prodId){
    try {
      return await CartModel.findOne({
        _id: cartId,
        products: { $elemMatch: { product: prodId } }
      });
    } catch (error) {
      console.error(error);
      throw new Error('Error checking product in cart');
    }
  }

  async addProdToCart(cartId, prodId, quantity) {
    try {
      const existProdInCart = await this.existProdInCart(cartId, prodId);
      if (existProdInCart) {
        return await CartModel.findOneAndUpdate(
          { _id: cartId, 'products.product': prodId },
          { $inc: { 'products.$.quantity': quantity } }, // Incrementa la cantidad por la cantidad proporcionada
          { new: true }
        );
      } else {
        return await CartModel.findByIdAndUpdate(
          cartId,
          { $push: { products: { product: prodId, quantity } } },
          { new: true }
        );
      }
    } catch (error) {
      console.error(error);
      throw new Error('Error adding product to cart');
    }
  }

  async removeProdToCart(cartId, prodId) {
    try {
      return await CartModel.findByIdAndUpdate(
        { _id: cartId },
        { $pull: { products: { product: prodId } } },
        { new: true }
      );
    } catch (error) {
      console.error(error);
      throw new Error('Error removing product from cart');
    }
  }

  async update(id, obj) {
    try {
      const response = await CartModel.findByIdAndUpdate(id, obj, {
        new: true,
      });
      return response;
    } catch (error) {
      console.error(error);
      throw new Error('Error updating cart');
    }
  }

  async updateProdQuantityToCart(cartId, prodId, quantity) {
    try {
      return await CartModel.findOneAndUpdate(
        { _id: cartId, 'products.product': prodId },
        { $set: { 'products.$.quantity': quantity } },
        { new: true }
      );
    } catch (error) {
      console.error(error);
      throw new Error('Error updating product quantity in cart');
    }
  }

  async clearCart(cartId) {
    try {
      return await CartModel.findOneAndUpdate(
        { _id: cartId },
        { $set: { products: [] } },
        { new: true }
      );
    } catch (error) {
      console.error(error);
      throw new Error('Error clearing cart');
    }
  }
}
