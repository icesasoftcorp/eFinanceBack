const express = require("express");
const checkAuth = require ("../middleware/check-auth");
const IncomeController = require('../controllers/income')
const router = express.Router();

/**
 * API routes for incomes
 */
router.post('', checkAuth, IncomeController.createIncome);
router.get('', checkAuth, IncomeController.retrieveIncomes);
router.post('/remove', checkAuth, IncomeController.removeIncomes);

module.exports = router;