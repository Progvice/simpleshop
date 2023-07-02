import express, { Request, Response, Router } from 'express';
const router: Router = express.Router();
import bodyParser from 'body-parser';
const jsonParser = bodyParser.json();
import categoriesController from '../controllers/admin/categoriesController';

router.get('/', (req: Request, res: Response, next) => {
    res.json({
        status: true,
        msg: "OK!",
    });
});

// CATEGORIES

router.post('/category/create', jsonParser, categoriesController.createCategory);
router.get('/category', jsonParser, categoriesController.readCategory);

export default router;