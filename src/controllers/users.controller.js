import { Router } from 'express';
import * as service from '../services/user.services.js';
import { UserModel } from '../daos/mongodb/models/user.model.js';
import { createHash } from '../utils/hashFuntions.js';
import { mailService } from "../services/mail.service.js";
import { smsService } from "../services/sms.service.js";

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

router.post('/', async (req, res, next) => {
  const { first_name, last_name, age, email, role, password } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ error: 'Falta información' });
  }

  try {
    // Hashear contraseña
    const hashPassword = createHash(password);

    const user = await UserModel.create({
      first_name,
      last_name,
      age,
      email,
      role,
      password: hashPassword,
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});



router.post('/add-product/:userId/:productId', async (req, res, next) => {
  try {
    const { userId, productId } = req.params;
    const newProductToUser = await service.addProductToUser(userId, productId);
    if (!newProductToUser) res.status(404).json({ msg: 'Usuario o Producto no existe' });
    else res.json(newProductToUser);
  } catch (error) {
    next(error);
  }
});

router.post('/create-file', async (req, res, next) => {
  try {
    const newUsers = await service.createFileUser();
    if (!newUsers) res.status(404).json({ msg: 'Error al crear usuario' });
    else res.json(`${newUsers} Usuarios insertados correctamente`);
  } catch (error) {
    next(error);
  }
});

router.get('/search-by-name', async (req, res, next) => {
  try {
    const { name } = req.query;
    const user = await service.getByNameUser(name);
    if (!user) res.status(404).json({ msg: 'Usuario no encontrado' });
    else res.json(user);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await service.getByIdUser(id);
    if (!user) res.status(404).json({ msg: 'Usuario no encontrado' });
    else res.json(user);
  } catch (error) {
    next(error);
  }
});

router.get('/search-by-email/:email', async (req, res, next) => {
  try {
    const { email } = req.params;
    const user = await service.getByEmailUser(email);
    if (!user) res.status(404).json({ msg: 'Usuario no encontrado' });
    else res.json(user);
  } catch (error) {
    next(error);
  }
});

router.get('/search-by-name-pagination', async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Añade valores por defecto para `page` y `limit`, asi evito errores
    const response = await service.getByNameUserWithPagination(page, limit);
    const nextLink = response.hasNextPage ? `/users/search-by-name-pagination?page=${response.nextPage}` : null;
    const prevLink = response.hasPrevPage ? `/users/search-by-name-pagination?page=${response.prevPage}` : null;
    res.json({
      data: response.docs,
      pageInfo: {
        totalItems: response.totalDocs,
        totalPages: response.totalPages,
        nextPage: nextLink,
        prevPage: prevLink,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, role, password } = req.body;

    const updatedUser = await service.updateUser(id, {
      first_name,
      last_name,
      age, 
      email,
      role,
      password,
    });

    if (!updatedUser) res.status(404).json({ msg: 'Error al actualizar usuario' });
    else res.json({ msg: 'Usuario actualizado', data: updatedUser });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedUser = await service.deleteUser(id);
    if (!deletedUser) res.status(404).json({ msg: 'Error al eliminar usuario' });
    else res.json({ msg: 'Usuario eliminado' });
  } catch (error) {
    next(error);
  }
});

// DB
const users = [];

class UserController {
  async getAll(req, res) {
    res.status(200).json(users);
  }

  async create(req, res) {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        error: "Falta información",
      });
    }

    if (users.find((user) => user.email === email)) {
      return res.status(400).json({
        error: "El email ya existe", // Mejora en el mensaje de error 
      });
    }

    users.push({
      name,
      email,
      phone,
    });

    // Enviar mail de bienvenida
    await mailService.sendMail({
      to: email,
      subject: "Bienvenido a nuestro servicio de mensajes masivos",
      type: "welcome",
    });

    await smsService.sendSms(
      phone,
      "Bienvenido a nuestro servicio de mensajes masivos"
    );

    res.status(201).json(users);
  }

  async activate(req, res) {
    // token = email encriptado
    const { token } = req.params;

    // Chequear que el token sea válido

    // Si el token es inválido o ha vencido, devolver error
    // Activar el usuario
  }
}

export default router;



// import { Router } from 'express';
// import * as service from '../services/user.services.js';
// import { UserModel } from '../daos/mongodb/models/user.model.js';
// import { createHash } from '../utils/hashFuntions.js';
// import { mailService } from "../services/mail.service.js";
// import { smsService } from "../services/sms.service.js";


// const router = Router();

// router.get('/', async (req, res, next) => {
//   try {
//     const users = await UserModel.find();
//     res.json(users);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error al obtener los usuarios' });
//   }
// });

// router.post('/', async (req, res, next) => {
//   const { first_name, last_name, age, email, role, password } = req.body;

//   if (!first_name || !last_name || !email || !password) {
//     return res.status(400).json({ error: 'Falta información' });
//   }

//   try {
//     // Hashear contraseña
//     const hashPassword = createHash(password);

//     const user = await UserModel.create({
//       first_name,
//       last_name,
//       age,
//       email,
//       role,
//       password: hashPassword,
//     });

//     res.status(201).json(user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error al crear el usuario' });
//   }
// });

// // router.get('/', async (req, res, next) => {
// //   try {
// //     const users = await UserModel.find();
// //     res.json(users);
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ error: 'Error al obtener los usuarios' });
// //   }
// // });

// // router.post('/', async (req, res, next) => {
// //   const { first_name, last_name, age,email, role, password } = req.body;

// //   if (!first_name || !last_name || !email || !password) {
// //     return res.status(400).json({
// //       error: 'Falta información',
// //     });
// //   }

// //   try {
// //     // Hashear contraseña
// //     const hashPassword = createHash(password);

// //     const user = await UserModel.create({
// //       first_name,
// //       last_name,
// //       age,
// //       email,
// //       role,
// //       password: hashPassword,
// //     });

// //     res.status(201).json(user);
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({
// //       error: 'Error al crear el usuario',
// //     });
// //   }
// // });

// router.post('/add-product/:userId/:productId', async (req, res, next) => {
//   try {
//     const { userId, productId } = req.params;
//     const newProductToUser = await service.addProductToUser(userId, productId);
//     if (!newProductToUser) res.status(404).json({ msg: 'Usuario o Producto no existe' });
//     else res.json(newProductToUser);
//   } catch (error) {
//     next(error);
//   }
// });

// router.post('/create-file', async (req, res, next) => {
//   try {
//     const newUsers = await service.createFileUser();
//     if (!newUsers) res.status(404).json({ msg: 'Error al crear usuario' });
//     else res.json(`${newUsers} Usuarios Insertados correctamente`);
//   } catch (error) {
//     next(error);
//   }
// });

// router.get('/search-by-name', async (req, res, next) => {
//   try {
//     const { name } = req.query;
//     const user = await service.getByNameUser(name);
//     if (!user) res.status(404).json({ msg: 'Usuario no encontrado' });
//     else res.json(user);
//   } catch (error) {
//     next(error);
//   }
// });

// router.get('/:id', async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const user = await service.getByIdUser(id);
//     if (!user) res.status(404).json({ msg: 'Usuario no encontrado' });
//     else res.json(user);
//   } catch (error) {
//     next(error);
//   }
// });

// router.get('/search-by-email/:email', async (req, res, next) => {
//   try {
//     const { email } = req.params;
//     const user = await service.getByEmailUser(email);
//     if (!user) res.status(404).json({ msg: 'Usuario no encontrado' });
//     else res.json(user);
//   } catch (error) {
//     next(error);
//   }
// });

// router.get('/search-by-name-pagination', async (req, res, next) => {
//   try {
//     const { page, limit } = req.query;
//     const response = await service.getByNameUserWithPagination(page, limit);
//     const nextLink = response.hasNextPage ? `/users/search-by-name-pagination?page=${response.nextPage}` : null;
//     const prevLink = response.hasPrevPage ? `/users/search-by-name-pagination?page=${response.prevPage}` : null;
//     res.json({
//       data: response.docs,
//       pageInfo: {
//         totalItems: response.totalDocs,
//         totalPages: response.totalPages,
//         nextPage: nextLink,
//         prevPage: prevLink,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// router.put('/:id', async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { first_name, last_name, email, role, password } = req.body;

//     const updatedUser = await service.updateUser(id, {
//       first_name,
//       last_name,
//       age,
//       email,
//       role,
//       password,
//     });

//     if (!updatedUser) res.status(404).json({ msg: 'Error al actualizar usuario' });
//     else res.json({ msg: 'Usuario actualizado', data: updatedUser });
//   } catch (error) {
//     next(error);
//   }
// });

// router.delete('/:id', async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     const deletedUser = await service.deleteUser(id);
//     if (!deletedUser) res.status(404).json({ msg: 'Error al eliminar usuario' });
//     else res.json({ msg: 'Usuario eliminado' });
//   } catch (error) {
//     next(error);
//   }
// });

// // DB
// const users = [];

// class UserController {
//   async getAll(req, res) {
//     res.status(200).json(users);
//   }

//   async create(req, res) {
//     const { name, email, phone } = req.body;

//     if (!name || !email || !phone) {
//       return res.status(400).json({
//         error: "Falta información",
//       });
//     }

//     if (users.find((user) => user.email === email)) {
//       return res.status(400).json({
//         error: "Email ya existe",
//       });
//     }

//     users.push({
//       name,
//       email,
//       phone,
//     });

//     // Enviar mail de bienvenida
//     await mailService.sendMail({
//       to: email,
//       subject: "Bienvenido a nuestro servicio de mensajes masivos",
//       type: "welcome",
//     });

//     await smsService.sendSms(
//       phone,
//       "Bienvenido a nuestro servicio de mensajes masivos"
//     );

//     res.status(201).json(users);
//   }

//   async activate(req, res) {
//     // token = email encriptado
//     const { token } = req.params;

//     // Chequear que el token sea válido

//     // Si el token es invalido o vence, devolver error

//     // Activar el usuario
//   }
// }



// export default router;





// import * as service from "../services/user.services.js";

// //agregamos el producto al user
// export const addProductToUser = async (req, res, next) => {
//   try {
//     const { userId } = req.params;
//     const { productId } = req.params;
//     const newproductToUser = await service.addproductToUser(userId, productId);
//     if(!newproductToUser) res.status(404).json({ msg: 'User or Product not exists' });
//     else res.json(newproductToUser);
//   } catch (error) {
//     next(error)
//   }
// }

// export const createFileCtr = async (req, res, next) => {     //createFileCtr
//   try {
//     const newUsers = await service.createFileUser();
//     if (!newUsers) res.status(404).json({ msg: "Error create user" });
//     else res.json(`${newUsers} Usuarios Insertados correctamente`);
//   } catch (error) {
//     next(error);
//   }
// };

// export const getByNameCtr = async (req, res, next) => {
//   try {
//     const { name } = req.query;
//     const item = await service.getByNameUser(name);
//     if (!item) res.status(404).json({ msg: "User not found" });
//     else res.json(item);
//   } catch (error) {
//     next(error);
//   }
// };

// export const getByIdCtr = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const item = await service.getByIdUser(id);
//     if (!item) res.status(404).json({ msg: "User not found" });
//     else res.json(item);
//   } catch (error) {
//     next(error);
//   }
// };

// export const getByEmailCtr = async (req, res, next) => {
//   try {
//     const { email } = req.params;
//     const item = await service.getByEmailUser(email);
//     if (!item) res.status(404).json({ msg: "User not found" });
//     else res.json(item);
//   } catch (error) {
//     next(error);
//   }
// };

// //paginacion de users se reemplazo el getAll por getByName

//  export const getByNameCtrl = async (req, res, next) => {
//    try {
//      const { page, limit } = req.query;
//      const response = await service.getByNameUser(page, limit);
//      const nextLink = response.hasNextPage ? `/users/all?page=${response.nextPage}` : null;
//      const prevLink = response.hasPrevPage ? `/users/all?page=${response.prevPage}` : null;
//      res.json({
//        data: response.docs,
//       pageInfo: {
//         totalItems: response.totalDocs,
//          totalPages: response.totalPages,
//          nextPage: nextLink,
//          prevPage: prevLink
//        }
//     });
//    } catch (error) {
//      next(error);
//    }
//  };

// export const createCtr = async (req, res, next) => {
//   try {
//     const user = { ...req.body };
//     const newUser = await service.createUser(user);
//     if (!newUser) res.status(404).json({ msg: "Error create user" });
//     else res.json(newUser);
//   } catch (error) {
//     next(error);
//   }
// };

// export const updateCtr = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { name, description, price, stock } = req.body;

//     const userUpdated = await service.updateUser(id, {
//       name,
//       description,
//       price,
//       stock,
//     });

//     if (!userUpdated) res.status(404).json({ msg: "Error update user" });

//     res.json({
//       msg: "User updated",
//       data: userUpdated,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const deleteCtr = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     const userDel = await service.deleteUser(id);
//     if (!userDel) res.status(404).json({ msg: "Error delete user" });
//     else
//       res.json({
//         msg: "User deleted",
//       });
//   } catch (error) {
//     next(error);
//   }
// };
