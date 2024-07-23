// Importaciones necesarias
import { Router } from 'express';
import * as controller from '../controllers/users.controller.js';
import * as service from "../services/user.services.js";
import { UserModel } from "../daos/mongodb/models/user.model.js";

// Importación de funciones de hashing
import { createHash, comparePassword } from "../utils/hashFuntions.js"; // Corrige el nombre del archivo si es hashFunctions.js

const router = Router();

// Obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los usuarios", details: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener el usuario", details: error.message });
  }
});

// Crear un nuevo usuario
router.post("/", async (req, res) => {
  const { first_name, last_name, email, role, password } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({
      error: "Falta información",
    });
  }

  try {
    // Hashear contraseña
    const hashPassword = createHash(password);

    const user = await UserModel.create({
      first_name,
      last_name,
      email,
      role,
      age,
      password: hashPassword,
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al crear el usuario",
    });
  }
});

export default router;







  // router de backend I





// router.post('/file', controller.createFileCtr);

// //router.get('/all', controller.getAllCtr);

// router.get('/', controller.getByNameCtr);



// router.get('/id/:id', controller.getByIdCtr);

// router.get('/email/:email', controller.getByEmailCtr);

// router.post('/', controller.createCtr);

// router.put('/:id', controller.updateCtr);

// router.delete('/:id', controller.deleteCtr);

// router.post('/add/:productId/:productId', controller.addProductToUser);

// router.post('/add/:userId/:productId', controller.addProductToUser);

// router.post('/', controller.createFileCtr);     

//router.get('/:id', controller.getByIdusers);


















// import { Router } from 'express';
// import * as controller from '../controllers/users.controllers.js';

// const router = Router();

// router.post('/file', controller.createFileCtr);

// router.get('/all', controller.getAllCtr);

// router.get('/', controller.getByNameCtr);

//  router.get('/:id', controller.getById);

// router.get('/id/:id', controller.getByIdCtr);

// router.get('/email/:email', controller.getByEmailCtr);

// router.post('/', controller.createCtr);

// router.put('/:id', controller.updateCtr);
//  router.put('/:id', controller.update);
// router.delete('/:id', controller.deleteCtr);
//  router.delete('/:id', controller.remove);

// export default router;