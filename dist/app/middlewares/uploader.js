"use strict";
// import multer from 'multer';
// import path from 'path';
// const storage = multer.diskStorage({
//   destination: 'image/',
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + '-' + file.originalname);
//   },
// });
// const uploader = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     const supportedImage = /\.(jpg|jpeg|png)$/;
//     const extension = path.extname(file.originalname);
//     if (supportedImage.test(extension)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Must be a png/jpg/jpeg image'));
//     }
//   },
//   limits: {
//     fileSize: 2000000,
//   },
// });
// export default uploader;
