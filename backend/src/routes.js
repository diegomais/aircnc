import express from 'express';
import multer from 'multer';
import uploadConfig from './config/upload.js';

import SessionController from './controllers/SessionController.js';
import SpotController from './controllers/SpotController.js';
import BookingController from './controllers/BookingController.js';
import DashboardController from './controllers/DashboardController.js';
import ApprovalController from './controllers/ApprovalController.js';
import RejectionController from './controllers/RejectionController.js';

const routes = express.Router();
const upload = multer(uploadConfig);

routes.post('/sessions', SessionController.store);

routes.get('/spots', SpotController.index);
routes.post('/spots', upload.single('thumbnail'), SpotController.store);

routes.post('/spots/:spot_id/bookings', BookingController.store);
routes.post('/bookings/:booking_id/approvals', ApprovalController.store);
routes.post('/bookings/:booking_id/rejections', RejectionController.store);

routes.get('/dashboard', DashboardController.show);

export default routes;
