import express from 'express';
import { BlogController } from './blog.controller';
const router = express.Router();

// create a Blog
router.post('/', BlogController.createBlog);
router.get('/', BlogController.getAllBlog);
router.get('/:id', BlogController.getSingleBlog);
router.patch('/:id', BlogController.updateBlog);
router.delete('/:id', BlogController.deleteBlog);
router.post('/:id/comments', BlogController.AddBlogComment);

export const BlogRoutes = router;
