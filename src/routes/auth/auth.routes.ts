import { Router } from 'express';
import { Controller } from '../../controllers/auth/auth.controller';
import { UserMiddleware } from '../../middlewares/user';
import { authValidation } from '../../config/validation/authValidation';

const router = Router();
const controller = new Controller();
const user = new UserMiddleware();

router.post('/', authValidation, controller.login);

router.post('/register', [user.isUserExists], controller.registerUser);

export default router;
