const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const CategoriesController = require('../controllers/category.controller');

router.get('/', CategoriesController.getCategories);
router.post('/', auth.required, CategoriesController.postCategory);

module.exports = router;