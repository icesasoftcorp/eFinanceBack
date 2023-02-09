const Income = require('../models/income');
const DataSourceResult = require('../models/DataSourceResult');
let dataSourceResult = new DataSourceResult();

/**
 * Creates an income
 * @param {*} req request
 * @param {*} res response
 * @param {*} next 
 */
exports.createIncome = (req, res, next) => {
    // const url = req.protocol + "://" + req.get("host"); 
    if (req.body._id) {
        const income = Income({
            title: req.body.title,
            description: req.body.description,
            amount: req.body.amount,
            category: req.body.category,
            account: req.body.account,
            creator: req.userData.userId,
            _id:req.body._id
        });
        const options = { upsert: false };
        income.updateOne(income,options).then((data) => {
            res.status(200).json({
                Data: data,
                id: data._id,
            });
        }).catch(err => {
            res.status(500).json({
                message: err.message
            })
        });
    } else {
        const income = new Income({
            title: req.body.title,
            description: req.body.description,
            amount: req.body.amount,
            category: req.body.category,
            account: req.body.account,
            creator: req.userData.userId,
        });
        income.save().then(data => {
            res.status(201).json({
                Data: data,
                id: data._id,
            });
        }).catch(err => {
            res.status(500).json({
                message: err.message
            })
        });
    }
};

/**
 * Retrieves incomes
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next
 */
exports.retrieveIncomes = (req, res, next) => {
    const today = new Date();
    const monthBeginning = new Date(today.getFullYear(), today.getMonth(), 1);
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
    const incomeQuery = Income.find({ creator: req.userData.userId, $lt: monthBeginning }).sort(sortJson);
    console.log(incomeQuery);
    let fetchedIncomes;
    if (currentPage && pageSize) {
        incomeQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    incomeQuery.then(documents => {
        fetchedIncomes = documents;
        return Income.find({ creator: req.userData.userId, $lt: monthBeginning }).count();
    }).then(count => {
        dataSourceResult.toDataSourceResult(fetchedIncomes);
        res.status(200).json(
            dataSourceResult
            // incomes: fetchedIncomes,
            // maxIncomes: count
        );
    }).catch(err => {
        res.status(500).json({
            message: err.message
        });
    });
};
/**
 * Remove income
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.removeIncomes = (req, res, next) => {
    const id = req.body.id;
    Income.findByIdAndDelete({ _id: id }).then(data => {
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