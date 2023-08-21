import express from 'express';
import { BlogController } from './blog.controller';
const router = express.Router();

// create a Blog
router.post('/', BlogController.createBlog);
router.get('/', BlogController.getAllBlog);

export const BlogRoutes = router;
