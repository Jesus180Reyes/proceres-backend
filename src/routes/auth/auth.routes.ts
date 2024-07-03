import { Router } from 'express';
import { Controller } from '../../controllers/auth/auth.controller';
import { UserMiddleware } from '../../middlewares/user';
import { authValidation } from '../../config/validation/authValidation';
import { AuthMiddleware } from '../../middlewares/auth';

const router = Router();
const controller = new Controller();
const user = new UserMiddleware();
const auth = new AuthMiddleware();
router.post('/', authValidation, controller.login);

router.get('/user/:id',[auth.auth], controller.getUserById);
router.post('/register', [user.isUserExists], controller.registerUser);

export default router;
