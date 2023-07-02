import express, { Request, Response, Router } from 'express';
import loginController from '../controllers/loginController';
const router: Router = express.Router();
import bodyParser from 'body-parser';
const jsonParser = bodyParser.json();


router.get('/', (req: Request, res: Response, next) => {
    res.json({
        status: true,
        msg: "Products route exists",
    });
});
router.post('/send', jsonParser, loginController.login);
export default router;