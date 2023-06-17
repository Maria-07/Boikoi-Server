import express from 'express';
import { CowController } from './cow.controller';

const router = express.Router();

// create a Cow Profile
router.post('/', CowController.createCow);

//get all Cow
router.get('/', CowController.getAllCow);

// get single Cow
router.get('/:id', CowController.getSingleCow);

// // update a Cow
// router.patch('/:id', CowController.updateCow);

// delete a Cow
router.delete('/:id', CowController.deleteCow);

export const CowRoutes = router;
