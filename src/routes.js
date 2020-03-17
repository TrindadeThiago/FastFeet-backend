import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import RecipientsController from './app/controllers/RecipientsController';
import DeliverymanController from './app/controllers/DeliverymanController';
import FileController from './app/controllers/FileController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/session', SessionController.store);

routes.use(authMiddleware);

routes.post('/deliverymans', DeliverymanController.store);
routes.put('/deliverymans/:id', DeliverymanController.update);
routes.get('/deliverymans', DeliverymanController.index);
routes.delete('/deliverymans/:id', DeliverymanController.delete);

routes.post('/recipients', RecipientsController.store);
routes.put('/recipients/:id', RecipientsController.update);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
