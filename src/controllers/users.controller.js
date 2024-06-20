import * as service from "../services/user.services.js";

//agregamos el producto al user
export const addProductToUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { productId } = req.params;
    const newproductToUser = await service.addproductToUser(userId, productId);
    if(!newproductToUser) res.status(404).json({ msg: 'User or Product not exists' });
    else res.json(newproductToUser);
  } catch (error) {
    next(error)
  }
}

export const createFileCtr = async (req, res, next) => {     //createFileCtr
  try {
    const newUsers = await service.createFileUser();
    if (!newUsers) res.status(404).json({ msg: "Error create user" });
    else res.json(`${newUsers} Usuarios Insertados correctamente`);
  } catch (error) {
    next(error);
  }
};

export const getByNameCtr = async (req, res, next) => {
  try {
    const { name } = req.query;
    const item = await service.getByNameUser(name);
    if (!item) res.status(404).json({ msg: "User not found" });
    else res.json(item);
  } catch (error) {
    next(error);
  }
};

export const getByIdCtr = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await service.getByIdUser(id);
    if (!item) res.status(404).json({ msg: "User not found" });
    else res.json(item);
  } catch (error) {
    next(error);
  }
};

export const getByEmailCtr = async (req, res, next) => {
  try {
    const { email } = req.params;
    const item = await service.getByEmailUser(email);
    if (!item) res.status(404).json({ msg: "User not found" });
    else res.json(item);
  } catch (error) {
    next(error);
  }
};

//paginacion de users se reemplazo el getAll por getByName

 export const getByNameCtrl = async (req, res, next) => {
   try {
     const { page, limit } = req.query;
     const response = await service.getByNameUser(page, limit);
     const nextLink = response.hasNextPage ? `/users/all?page=${response.nextPage}` : null;
     const prevLink = response.hasPrevPage ? `/users/all?page=${response.prevPage}` : null;
     res.json({
       data: response.docs,
      pageInfo: {
        totalItems: response.totalDocs,
         totalPages: response.totalPages,
         nextPage: nextLink,
         prevPage: prevLink
       }
    });
   } catch (error) {
     next(error);
   }
 };

export const createCtr = async (req, res, next) => {
  try {
    const user = { ...req.body };
    const newUser = await service.createUser(user);
    if (!newUser) res.status(404).json({ msg: "Error create user" });
    else res.json(newUser);
  } catch (error) {
    next(error);
  }
};

export const updateCtr = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;

    const userUpdated = await service.updateUser(id, {
      name,
      description,
      price,
      stock,
    });

    if (!userUpdated) res.status(404).json({ msg: "Error update user" });

    res.json({
      msg: "User updated",
      data: userUpdated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCtr = async (req, res, next) => {
  try {
    const { id } = req.params;

    const userDel = await service.deleteUser(id);
    if (!userDel) res.status(404).json({ msg: "Error delete user" });
    else
      res.json({
        msg: "User deleted",
      });
  } catch (error) {
    next(error);
  }
};
