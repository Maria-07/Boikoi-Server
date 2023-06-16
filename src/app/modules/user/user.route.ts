import express from 'express';
import { UserController } from './user.controller';

const router = express.Router();

//get all students
router.get('/', UserController.getAllUsers);

// get single User
router.get('/:id', UserController.getSingleUser);

// delete a User
router.delete('/:id', UserController.deleteUser);

export const UserRoutes = router;
