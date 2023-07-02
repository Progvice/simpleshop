import express, { Request, Response, Router } from 'express';
import logoutController from '../controllers/logoutController';
const router: Router = express.Router();
import bodyParser from 'body-parser';
const jsonParser = bodyParser.json();

router.get('/', jsonParser, logoutController.logout);

export default router;