const IncomeCategory = require('../models/incomeCategory');
const DataSourceResult = require('../models/DataSourceResult');
let dataSourceResult = new DataSourceResult();

/**
 * Creates account category
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.createIncomeCategory = (req, res, next) => {
    // const url = req.protocol + "://" + req.get("host"); 
    const incomeCategory = new IncomeCategory({
        title: req.body.title,
        icon: req.body.icon,
        color: req.body.color,
        creator: req.userData.userId ? req.userData.userId : null
    });
    incomeCategory.save().then(income => {
        res.status(201).json({
            incomeCategory: {
                ... incomeCategory,
                id: incomeCategory._id,
            }
        });
    }).catch( err => {
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
exports.retrieveAccountCategories = (req, res, next) => {
    const pageSize = + req.query.pageSize;
    const currentPage = + req.query.page;
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
    const incomeCategoryQuery = IncomeCategory.find().sort(sortJson);
    let fetchedIncomeCategories;
    if (currentPage && pageSize) {
        incomeCategoryQuery.skip(pageSize *(currentPage - 1)).limit(pageSize);
    }
    incomeCategoryQuery.then( documents => {
        fetchedIncomeCategories = documents;
        return IncomeCategory.count();
    }).then(count => {
        dataSourceResult.toDataSourceResult(fetchedIncomeCategories);
        res.status(200).json(
            dataSourceResult
            // incomeCategories: fetchedIncomeCategories,
            // maxIncomeCategories: count
        );
    }).catch(err => {
        res.status(500).json({
            message: err.message
        });
    });
};

/**
 * Remove incomeCategory
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.removeCategory = (req, res, next) => {
    const id = req.body.id;
    IncomeCategory.findByIdAndDelete({ _id: id }).then(data => {
        res.status(200).json({
            data,
            id: data._id
        });
    }).catch(err => {
        res.status(500).json({
            message: err.message
        })
    });
};