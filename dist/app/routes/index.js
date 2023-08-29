"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const shop_route_1 = require("../modules/shop/shop.route");
const book_router_1 = require("../modules/book/book.router");
const blog_route_1 = require("../modules/blog/blog.route");
// import { ImageRouter } from '../modules/imageUploader/imageUpload.route';
const routes = express_1.default.Router();
const moduleRoutes = [
    // {
    //   path: '/single-image-upload',
    //   route: ImageRouter,
    // },
    {
        path: '/users',
        route: user_route_1.UserRoutes,
    },
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/shops',
        route: shop_route_1.ShopRoutes,
    },
    {
        path: '/books',
        route: book_router_1.BookRoutes,
    },
    {
        path: '/blogs',
        route: blog_route_1.BlogRoutes,
    },
];
moduleRoutes.forEach(route => {
    routes.use(route.path, route.route);
});
exports.default = routes;
