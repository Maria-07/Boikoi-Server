'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]];
      }
    return t;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.BlogController = void 0;
const catchAsync_1 = __importDefault(require('../../../shared/catchAsync'));
const blog_service_1 = require('./blog.service');
const sendResponse_1 = __importDefault(require('../../../shared/sendResponse'));
const http_status_1 = __importDefault(require('http-status'));
const blog_constance_1 = require('./blog.constance');
const pick_1 = __importDefault(require('../../../shared/pick'));
const paginationC_1 = require('../../../constance/paginationC');
const ApiError_1 = __importDefault(require('../../../errors/ApiError'));
// create a Blog
const createBlog = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const blogData = __rest(req.body, []);
    const result = yield blog_service_1.BlogService.createBlog(blogData);
    (0, sendResponse_1.default)(res, {
      success: true,
      statusCode: http_status_1.default.OK,
      message: 'Blog created successfully',
      data: result,
    });
  })
);
// get all Blog [search and filter]
const getAllBlog = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(
      req.query,
      blog_constance_1.BlogFilterableFields
    );
    const paginationOption = (0, pick_1.default)(
      req.query,
      paginationC_1.paginationFields
    );
    const result = yield blog_service_1.BlogService.getAllBlog(
      filters,
      paginationOption
    );
    (0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: 'Blogs retrieved successfully',
      meta: result.meta,
      data: result.data,
    });
  })
);
// get a single Blog
const getSingleBlog = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield blog_service_1.BlogService.getSingleBlog(id);
    (0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: 'Blog retrieved successfully',
      data: result,
    });
  })
);
// Update Blog
const updateBlog = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updatedData = req.body;
    const result = yield blog_service_1.BlogService.updateBlog(id, updatedData);
    (0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: 'Blog Updated successfully',
      data: result,
    });
  })
);
// Delete Blog
const deleteBlog = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield blog_service_1.BlogService.deleteBlog(id);
    (0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: 'Blog Deleted successfully',
      data: result,
    });
  })
);
//* Add comments
const AddBlogComment = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const blogId = req.params.id;
    const { name, comment } = req.body;
    const blog = yield blog_service_1.BlogService.getSingleBlog(blogId);
    if (!blog) {
      throw new ApiError_1.default(
        http_status_1.default.NOT_FOUND,
        'blog not found'
      );
    }
    // Make sure blog.comments is defined before pushing the new review
    if (!blog.comments) {
      blog.comments = [];
    }
    // Add the review to the blog's comments array
    const comments = { name, comment };
    blog.comments.push(comments);
    // Save the updated blog with the new review
    yield blog_service_1.BlogService.AddBlogComment(blogId, comments);
    (0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: 'Blog Comment added successfully!',
      data: blog,
    });
  })
);
exports.BlogController = {
  createBlog,
  getAllBlog,
  getSingleBlog,
  updateBlog,
  deleteBlog,
  AddBlogComment,
};
