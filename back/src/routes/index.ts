import express, { Request, Response, Router } from 'express';

const router: Router = express.Router();

router.get('/', (req: Request, res: Response, next) => {
    res.json({
        status: true,
        msg: "OK!",
    });
});

export default router;