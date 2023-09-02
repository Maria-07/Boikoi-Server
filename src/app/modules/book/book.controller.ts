import { Request, RequestHandler, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constance/paginationC';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import ApiError from '../../../errors/ApiError';
import { bookFilterableFields } from '../../../constance/filterableFields';
import { IBook, IReview } from './book.interface';
import { BookService } from './book.service';
import { Book } from './book.model';

// create a Book profile
const createBook: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const token = req.headers.authorization;

    let verifiedToken = null;

    try {
      verifiedToken = jwtHelpers.verifyToken(
        token as string,
        config.jwt.secret as Secret
      );
    } catch (err) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
    }

    console.log('verifiedToken =======', verifiedToken);

    const { userEmail } = verifiedToken;

    const { ...bookData } = req.body;
    const result = await BookService.createBook({ ...bookData, userEmail });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Book created successfully',
      data: result,
    });
  }
);

// get all Book [search and filter]
const getAllBook = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, bookFilterableFields);
  // console.log('filters ==== ', filters);

  const paginationOption = pick(req.query, paginationFields);

  const result = await BookService.getAllBook(filters, paginationOption);

  sendResponse<IBook[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Books retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get a single Book
const getSingleBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BookService.getSingleBook(id);

  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book retrieved successfully',
    data: result,
  });
});

// Update Book
const updateBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;
  const token = req.headers.authorization;

  const result = await BookService.updateBook(id, updatedData, token as string);

  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book Updated successfully',
    data: result,
  });
});

// Delete Book
const deleteBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const token = req.headers.authorization;
  // BookAuth(token as string, id);

  const result = await BookService.deleteBook(id, token as string);

  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book Deleted successfully',
    data: result,
  });
});

//* Add reviews
const addReview = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const addReview = req.body.reviews;

  console.log('new review : ', addReview);

  const result = await Book.updateOne(
    { _id: id },
    { $push: { reviews: addReview } }
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Add Review successfully',
    data: result,
  });
});

const AddBookReview: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const bookID = req.params.id;
    const { name, rating, review } = req.body;

    const book = await BookService.getSingleBook(bookID);

    if (!book) {
      throw new ApiError(httpStatus.NOT_FOUND, 'book not found');
    }

    // Make sure book.reviews is defined before pushing the new review
    if (!book.reviews) {
      book.reviews = [];
    }

    // Add the review to the book's reviews array
    const newReview: IReview = { name, rating, review };
    book.reviews.push(newReview);

    // Save the updated book with the new review
    await BookService.AddBookReview(bookID, newReview);

    sendResponse<IBook>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Review added successfully!',
      data: book,
    });
  }
);

//* get reviews
const getAllReview = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  console.log(id);

  const result = await Book.findOne({ _id: id }).select({ reviews: 1, _id: 0 });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'get all Review successfully',
    data: result,
  });
});

export const BookController = {
  createBook,
  getAllBook,
  getSingleBook,
  deleteBook,
  updateBook,
  addReview,
  getAllReview,
  AddBookReview,
};
