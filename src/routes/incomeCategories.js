const express = require("express");
const IncomCategoriesController = require('../controllers/incomeCategory')
const router = express.Router();
const checkAuth = require ("../middleware/check-auth");

/**
 * API routes for incomes
 */
router.post('', checkAuth, IncomCategoriesController.createIncomeCategory);
router.get('', checkAuth, IncomCategoriesController.retrieveAccountCategories);
router.post('/remove', checkAuth, IncomCategoriesController.removeCategory);

module.exports = router;