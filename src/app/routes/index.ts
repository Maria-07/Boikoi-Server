import express from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { ShopRoutes } from '../modules/shop/shop.route';
import { BookRoutes } from '../modules/book/book.router';
import { BlogRoutes } from '../modules/blog/blog.route';
import { OldBookRoutes } from '../modules/oldBook/oldBook.router';

const routes = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/shops',
    route: ShopRoutes,
  },
  {
    path: '/books',
    route: BookRoutes,
  },
  {
    path: '/oldBooks',
    route: OldBookRoutes,
  },
  {
    path: '/blogs',
    route: BlogRoutes,
  },
];

moduleRoutes.forEach(route => {
  routes.use(route.path, route.route);
});

export default routes;
