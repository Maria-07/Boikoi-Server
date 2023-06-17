"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/user/auth.route");
const user_route_1 = require("../modules/user/user.route");
const cow_route_1 = require("../modules/cow/cow.route");
const order_route_1 = require("../modules/order/order.route");
const routes = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/users',
        route: user_route_1.UserRoutes,
    },
    {
        path: '/cows',
        route: cow_route_1.CowRoutes,
    },
    {
        path: '/orders',
        route: order_route_1.UserOrders,
    },
];
moduleRoutes.forEach(route => {
    routes.use(route.path, route.route);
});
exports.default = routes;
