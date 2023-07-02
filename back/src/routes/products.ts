import express, { Request, Response, Router } from 'express';

const router: Router = express.Router();

import productsController from '../controllers/productsController';

router.get('/', (req: Request, res: Response, next) => {
    res.json({
        status: true,
        msg: "Products route exists",
    });
});
router.get('/product/:id', productsController.readProduct);

export default router;