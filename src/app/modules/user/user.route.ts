import express from 'express';
import { UserController } from './user.controller';

const router = express.Router();

//get all students
router.get('/', UserController.getAllUsers);

export const UserRoutes = router;
