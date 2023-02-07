const ExpenseCategory = require('../models/expenseCategory');
const DataSourceResult = require('../models/DataSourceResult');
let dataSourceResult = new DataSourceResult();
/**
 * Creates account category
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.createExpenseCategory = (req, res, next) => {
    const expenseCategory = new ExpenseCategory({
        title: req.body.title,
        icon: req.body.icon,
        color: req.body.color,
        creator: req.userData.userId ? req.userData.userId : null
    });
    expenseCategory.save().then(expenseCategory => {
        dataSourceResult.toDataSourceResult(expenseCategory);
        res.status(201).json(dataSourceResult);
    }).catch(err => {
        res.status(500).json({
            message: err.message
        })
    });
};

/**
 * Retrieves account categories list
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.retrieveExpenseCategories = (req, res, next) => {
    const fieldSort = req.query.sort;
    let arraySort = (fieldSort != undefined ? fieldSort : "").split("~");
    let sortJson = {};
    arraySort.forEach(e => {
        if (e != '') {
            let arrayPrmSort = e.split("-");
            let sortType = arrayPrmSort[1] == "asc" ? 1 : -1;
            sortJson[arrayPrmSort[0]] = sortType;
        }
    });
    const pageSize = + req.query.pageSize;
    const currentPage = + req.query.page;
    const expenseCategoryQuery = ExpenseCategory.find({ creator: req.userData.userId }).sort(sortJson);
    let fetchedExpenseCategories;
    if (currentPage && pageSize) {
        expenseCategoryQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    expenseCategoryQuery.then(documents => {
        fetchedExpenseCategories = documents;
        return ExpenseCategory.count();
    }).then(count => {
        dataSourceResult.toDataSourceResult(fetchedExpenseCategories);
        res.status(200).json(dataSourceResult);
    }).catch(err => {
        res.status(500).json({
            message: err.message
        });
    });
};

/**
 * Remove Expense Categories
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.removeExpenseCategories = (req, res, next) => {
    const id = req.body.id;
    ExpenseCategory.findByIdAndDelete({ _id: id }).then(data => {
        dataSourceResult.toDataSourceResult(data);
        res.status(200).json(dataSourceResult);
    }).catch(err => {
        res.status(500).json({
            message: err.message
        })
    });
};