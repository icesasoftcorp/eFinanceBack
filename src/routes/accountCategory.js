const express = require("express");
const router = express.Router();
const checkAuth = require ("../middleware/check-auth");
const AccountCategoryController = require('../controllers/accountCategory');

/**
 * API routes for account categories
 */
 router.post('', checkAuth, AccountCategoryController.createAccountCategory);
 router.get('', checkAuth,AccountCategoryController.retrieveAccountCategories);
 router.post('/remove', checkAuth,AccountCategoryController.deleteAccountCategory);

 module.exports = router;