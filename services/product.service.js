const BaseService = require('./base.service');
const Product = require('../models/product.model');

class ProductService extends BaseService {
    constructor() {
        super(Product);
    }
}

module.exports = new ProductService();
