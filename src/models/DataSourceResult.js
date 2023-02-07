class DataSourceResult {
    constructor() {
        this.data = [];
        this.total = 0;
        this.aggregateResults = [];
        this.errors = null;
    }
    setData(data) {
        this.data = data;
    }

    setTotal(total) {
        this.total = total;
    }

    setAggregateResults(aggregateResults) {
        this.aggregateResults = aggregateResults;
    }

    setErrors(errors) {
        this.errors = errors;
    }

    getData() {
        return this.data;
    }

    getTotal() {
        return this.total;
    }

    getAggregateResults() {
        return this.aggregateResults;
    }

    getErrors() {
        return this.errors;
    }
    toDataSourceResult(data, total, aggregateResults, errors) {
        let arrayData = Array.isArray(data) ? data : data != null ? [data] : null;
        this.data = arrayData;
        this.total = total == null ? arrayData?.length : total;
        this.aggregateResults = aggregateResults;
        this.errors = errors;
    }
}

module.exports = DataSourceResult;