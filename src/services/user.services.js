import UserDaoMongoDB from "../daos/mongodb/user.dao.js";


const userDao = new UserDaoMongoDB();

import productDaoMongoDB from "../daos/mongodb/product.dao.js";
const productDao = new productDaoMongoDB();

import fs from "fs"; //traigo a filesystem
//import { dirname } from "../utils.js ";  //exporto dirname

export const addproductToUser = async (userId, productId) => {
  try {
    const exists = await productDao.getproductById(productId);
    if(!exists) return null; //verifico que el producto exista
    else return await userDao.addproductToUser(userId, productIdId);
  } catch (error) {
    throw new Error(error)
  }
}

export const getByIdUser = async (id) => {
  try {
    const user = await userDao.getById(id);
    if (!user) return false;
    else return user;
  } catch (error) {
    console.log(error);
  }
};

export const getByNameUser = async (id) => {
  try {
    const user = await userDao.getByNameUser(id);
    if (!user) return false;
    else return user;
  } catch (error) {
    console.log(error);
  }
};
export const createFileUser = async () => {
  try {
    const usersFile = JSON.parse(fs.readFileSync(`${__dirname}/data/Users.json`, 'utf8'));
    const newUsers = await userDao.createUser(usersFile);
    return newUsers.length;
  } catch (error) {
    throw new Error(error)
  }
}

export const getByEmailUser = async (email) => {
  try {
    const user = await userDao.getByEmail(email);
    if (!user) return false;
    else return user;
  } catch (error) {
    console.log(error);
  }
};

export const createUser = async (obj) => {
  try {
    const newUser = await userDao.create(obj);
    if (!newUser) throw new Error("Validation Error!");
    else return newUser;
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async (id, obj) => {
  try {
    let item = await userDao.getById(id);
    if (!item) {
      throw new Error("User not found!");
    } else {
      const userUpdated = await userDao.update(id, obj);
      return userUpdated;
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteUser = async (id) => {
  try {
    const userDeleted = await userDao.delete(id);
    return userDeleted;
  } catch (error) {
    console.log(error);
  }
};
