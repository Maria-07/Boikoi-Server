'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.CowRoutes = void 0;
const express_1 = __importDefault(require('express'));
const cow_controller_1 = require('./cow.controller');
const router = express_1.default.Router();
// create a Cow Profile
router.post('/', cow_controller_1.CowController.createCow);
//get all Cow
router.get('/', cow_controller_1.CowController.getAllCow);
// get single Cow
router.get('/:id', cow_controller_1.CowController.getSingleCow);
// update a Cow
router.patch('/:id', cow_controller_1.CowController.updateCow);
// delete a Cow
router.delete('/:id', cow_controller_1.CowController.deleteCow);
exports.CowRoutes = router;
