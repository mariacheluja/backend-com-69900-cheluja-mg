//router de users verificar que me lleve bien a los archivos
import { Router } from 'express';
import * as controller from '../controllers/users.controller.js';
import * as service from "../services/user.services.js";
import { UserModel } from "../daos/mongodb/models/user.model.js";

// importo el modelo de user y lo guardo en una constante
 
import { createHash } from "../utils/hashFuntions.js"; 
import {comparePassword} from "../utils/hashFuntions.js";


const router = Router();

router.get("/", async (req, res) => {
    const users = await UserModel.find();
    res.json(users);
  });
  
  router.post("/", async (req, res) => {
    const { first_name, last_name, email, role, password } = req.body;
  
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        error: "Falta información",
      });
    }
  
    try {
      // Hashear contraseña, configuracion del hasheo como pide la consigna 
      const hashPassword = createHash(password);
  
      const user = await userModel.create({
        first_name,
        last_name,
        email,
        role,
        password: hashPassword,
      });
  
      res.status(201).json(user);
    } catch (error) {
      console.log(error);
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