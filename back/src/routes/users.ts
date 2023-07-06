import express, { Request, Response, Router } from 'express';
import usersController from '../controllers/usersController';
import bodyParser from 'body-parser';
const jsonParser = bodyParser.json();

const router: Router = express.Router();
// Default route
router.get('/', (req: Request, res: Response, next) => {
    res.json({
        status: true,
        msg: "OK!",
    });
});

// CRUD ROUTES
router.post('/create', jsonParser, usersController.createUser);
router.get('/id/:id', usersController.readUser);
router.put('/update/:id', jsonParser, usersController.updateUser);
router.delete('/delete/:id', jsonParser, usersController.deleteUser);
router.post('/auth', jsonParser, usersController.authUser);
export default router;