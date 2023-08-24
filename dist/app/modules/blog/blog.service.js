"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const blog_constance_1 = require("./blog.constance");
const blog_model_1 = require("./blog.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
// create a Blog
const createBlog = (blogData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blog_model_1.Blog.create(blogData);
    return result;
});
// get all Blogs
const getAllBlog = (filters, paginationOption) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters;
    const andCondition = [];
    if (searchTerm) {
        andCondition.push({
            $or: blog_constance_1.blogSearchableFields.map(field => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }
    const { page, limit, skip, sortBy, sortOrder } = paginationHelpers_1.paginationHelpers.calculationPagination(paginationOption);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
    const result = yield blog_model_1.Blog.find(whereCondition)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield blog_model_1.Blog.countDocuments(whereCondition);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
// get a single Blog
const getSingleBlog = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blog_model_1.Blog.findById(id);
    return result;
});
// updated Blog
const updateBlog = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blog_model_1.Blog.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return result;
});
// Delete Blog
const deleteBlog = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blog_model_1.Blog.findByIdAndDelete({ _id: id }, { new: true });
    return result;
});
// add Comment
const AddBlogComment = (blogId, comments) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_model_1.Blog.findById(blogId).lean().exec();
    console.log('comments', comments);
    if (!blog) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'blog not found');
    }
    if (!blog.comments) {
        blog.comments = [];
    }
    comments.date = new Date();
    blog.comments.push(comments);
    yield blog_model_1.Blog.findByIdAndUpdate(blogId, {
        comments: blog.comments,
    })
        .sort('date')
        .exec();
});
exports.BlogService = {
    createBlog,
    getAllBlog,
    getSingleBlog,
    updateBlog,
    deleteBlog,
    AddBlogComment,
};
