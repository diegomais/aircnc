import express from 'express';
import multer from 'multer';
import uploadConfig from './config/upload.js';

import { SessionController } from './controllers/SessionController.js';
import SpotController from './controllers/SpotController.js';
import BookingController from './controllers/BookingController.js';
import { DashboardController } from './controllers/DashboardController.js';
import ApprovalController from './controllers/ApprovalController.js';
import RejectionController from './controllers/RejectionController.js';

import { SpotsRepository } from './repositories/SpotsRepository.js';
import { UsersRepository } from './repositories/UsersRepository.js'

import { SessionService } from './services/SessionService.js'
import { SpotService } from './services/SpotService.js';

const routes = express.Router();
const upload = multer(uploadConfig);

const usersRepository = new UsersRepository();
const sessionService = new SessionService({ usersRepository });
const sessionController = new SessionController({ sessionService });
routes.post('/sessions', sessionController.create);

routes.get('/spots', SpotController.index);
routes.post('/spots', upload.single('thumbnail'), SpotController.store);

routes.post('/spots/:spot_id/bookings', BookingController.store);
routes.post('/bookings/:booking_id/approvals', ApprovalController.store);
routes.post('/bookings/:booking_id/rejections', RejectionController.store);

const spotsRepository = new SpotsRepository();
const spotService = new SpotService({ spotsRepository });
const dashboardController = new DashboardController({ spotService });
routes.get('/dashboard', dashboardController.show);

export default routes;
