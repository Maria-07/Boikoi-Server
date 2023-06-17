import express from 'express';
import { AuthRoutes } from '../modules/user/auth.route';
import { UserRoutes } from '../modules/user/user.route';
import { CowRoutes } from '../modules/cow/cow.route';
import { UserOrders } from '../modules/order/order.route';

const routes = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/cows',
    route: CowRoutes,
  },
  {
    path: '/orders',
    route: UserOrders,
  },
];

moduleRoutes.forEach(route => {
  routes.use(route.path, route.route);
});

export default routes;
