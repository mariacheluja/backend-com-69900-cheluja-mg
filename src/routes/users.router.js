//router de users verificar que me lleve bien a los archivos
import { Router } from 'express';
import * as controller from '../controllers/users.controller.js';
import * as service from "../services/user.services.js";
const router = Router();

router.post('/file', controller.createFileCtr);

//router.get('/all', controller.getAllCtr);

router.get('/', controller.getByNameCtr);



router.get('/id/:id', controller.getByIdCtr);

router.get('/email/:email', controller.getByEmailCtr);

router.post('/', controller.createCtr);

router.put('/:id', controller.updateCtr);

router.delete('/:id', controller.deleteCtr);

router.post('/add/:productId/:productId', controller.addProductToUser);

router.post('/add/:userId/:productId', controller.addProductToUser);

router.post('/', controller.createFileCtr);     

//router.get('/:id', controller.getByIdusers);



export default router;















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