import ProductDaoMongoDB from "../daos/mongodb/product.dao.js";
const prodDao = new ProductDaoMongoDB();

export const getAll = async (page, limit, title, category, sort) => {
  try {
    return await prodDao.getAll(page, limit, title, category, sort); // respetar el orden en que pusimos los parametros
  } catch (error) {
    console.log(error);
  }
};

export const getById = async (id) => {
  try {
    const prod = await prodDao.getById(id);
    if (!prod) return false;
    else return prod;
  } catch (error) {
    console.log(error);
  }
};

export const create = async (obj) => {
  try {
    const newProd = await prodDao.create(obj);
    if (!newProd) return false;
    else return newProd;
  } catch (error) {
    console.log(error);
  }
};

export const update = async (prodid, obj) => {
  try {
    const prodUpd = await prodDao.update(prodid, obj);
    if (!prodUpd) return false;
    else return prodUpd;
  } catch (error) {
    console.log(error);
  }
};

export const remove = async (prodid) => {
  try {
    const prodDel = await prodDao.delete(id);
    if (!prodDel) return false;
    else return prodDel;
  } catch (error) {
    console.log(error);
  }
};
