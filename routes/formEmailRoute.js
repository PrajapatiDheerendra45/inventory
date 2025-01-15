import express from 'express';

import { formSubmitController } from '../controllers/fromSubmitController.js';


const router = express.Router();

// Route to handle form submission and send email
router.post('/sendEmail', formSubmitController);

export default router;
