import express, { Request, Response, Router } from 'express';
const router: Router = express.Router();
import bodyParser from 'body-parser';
const jsonParser = bodyParser.json();
import categoriesController from '../controllers/categoriesController';
import categoriesAdminController from '../controllers/admin/categoriesController';


// CLIENT ROUTES
router.get('/', jsonParser, categoriesController.listCategories);


// ADMIN ROUTES
router.post('/category/create', jsonParser, categoriesAdminController.createCategory);


export default router;