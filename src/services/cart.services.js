//llama a los metodos CRUD

import ProductDaoMongoDB from "../daos/mongodb/product.dao.js";
const prodDao = new ProductDaoMongoDB();

import CartDaoMongoDB from "../daos/mongodb/cart.dao.js";
const cartDao = new CartDaoMongoDB();

export const getAll = async () => {
  try {
    return await cartDao.getAll();
  } catch (error) {
    console.log(error);
  }
};

export const getById = async (CartId) => {
  try {
    return await cartDao.getById(CartId);
  } catch (error) {
    console.log(error);
  }
};

export const create = async () => {
  try {
    const newcart = await cartDao.create();
    if (!newcart) return false;
    else return newcart;
  } catch (error) {
    console.log(error);
  }
};

export const update = async (cartId, obj) => {
  try {
    return await cartDao.update(id, obj);
  } catch (error) {
    console.log(error);
  }
};

export const remove = async (cartId) => {
  try {
    const cartDel = await cartDao.delete(cartId);
    if (!cartDel) return false;
    else return cartDel;
  } catch (error) {
    console.log(error);
  }
};

// export const addProdToCart = async (cartId, prodId) => {
//   try {
//     const existCart = await getById(cartId);
//     if (!existCart) return null;

//     const existProd = await prodDao.getById(prodId);
//     if (!existProd) return null;

//     return await cartDao.addProdToCart(cartId, prodId);
//   } catch (error) {
//     console.log(error);
//   }
// };export const addProdToCart = async (cartId, prodId) => { 
  export const addProdToCart = async (cartId, prodId) => { 
    try {
      const existCart = await getById(cartId);
      if (!existCart) return null;
  
      const existProd = await prodDao.getById(prodId);
      if (!existProd) return null;
  
      const existProdInCart = await cartDao.existProdInCart(cartId, prodId);
  
      if (existProdInCart) {
        const quantity = existProdInCart.products.find(product => product.toString() === prodId.toString()).quantity+1;
      return await cartDao.addProdToCart(cartId, prodId, quantity);
    } 
    return await cartDao.addProdToCart(cartId, prodId);
  } catch (error) {
      console.log(error);
    }
  } 



export const removeProdToCart = async (cartId, prodId) => {
  try {
    const existCart = await getById(cartId);
    // console.log(existCart)
    if (!existCart) return null;
    const existProdInCart = await cartDao.existProdInCart(cartId, prodId);
    // console.log(existProdInCart)
    if (!existProdInCart) return null;
    return await cartDao.removeProdToCart(cartId, prodId);
  } catch (error) {
    console.log(error);
  }
};

export const updateProdQuantityToCart = async (cartId, prodId, quantity) => {
  try {
    const existCart = await getById(cartId);
    if (!existCart) return null;
    const existProdInCart = await cartDao.existProdInCart(cartId, prodId);
    if (!existProdInCart) return null;
    return await cartDao.updateProdQuantityToCart(cartId, prodId, quantity);
  } catch (error) {
    console.log(error);
  }
};

export const clearCart = async (cartId) => {
  try {
    const existCart = await getById(cartId);
    if (!existCart) return null;
    return await cartDao.clearCart(cartId)
  } catch (error) {
    console.log(error);
  }
};
