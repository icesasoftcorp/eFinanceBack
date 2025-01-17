const Estimation = require('../models/estimation');
const DataSourceResult = require('../models/DataSourceResult');
let dataSourceResult = new DataSourceResult();

/**
 * Creates estimation
 */
exports.createEstimation = (req, res, next) => {
    if (req.body._id) {
        const estimation = new Estimation({
            title: req.body.title,
            amount: req.body.amount,
            category: req.body.category,
            creator: req.userData.userId ? req.userData.userId : null,
            _id: req.body._id
        });
        const options = { upsert: false };
        estimation.updateOne(estimation, options).then((data) => {
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
        const estimation = new Estimation({
            title: req.body.title,
            amount: req.body.amount,
            category: req.body.category,
            creator: req.userData.userId
        });
        estimation.save().then(estimation => {
            res.status(201).json({
                estimation: {
                    ...estimation,
                    id: estimation._id,
                }
            });
        })
            .catch(err => {
                res.status(500).json({
                    message: err.message
                })
            });
    }
};

/**
 * Retrieves estimations
 */
exports.retrieveEstimations = (req, res, next) => {
    const today = new Date();
    const monthBeginning = new Date(today.getFullYear(), today.getMonth(), 1);

    const pageSize = + req.query.pageSize;
    const currentPage = + req.query.page;
    const estimationQuery = Estimation.find({ creator: req.userData.userId, $lt: monthBeginning });
    let fetchedEstimations;
    if (currentPage && pageSize) {
        estimationQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    estimationQuery.then(documents => {
        fetchedEstimations = documents;
        return Estimation.find({ creator: req.userData.userId, $lt: monthBeginning }).count();
    }).then(count => {
        dataSourceResult.toDataSourceResult(fetchedEstimations);
        res.status(200).json(
            dataSourceResult
            // estimations: fetchedEstimations,
            // maxEstimations: count,
            // since: monthBeginning
        );
    }).catch(err => {
        res.status(500).json({
            message: err.message
        });
    });
};

/**
 * Delete estimation
 */
exports.deleteEstimation = (req, res, next) => {
    const { id } = req.body;
    Estimation.findByIdAndDelete({ _id: id })
        .then((deleteEstimation) => {
            res.status(200).json({
                message: 'The record has been deleted',
                result: deleteEstimation,
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: err.message,
            });
        });
};
