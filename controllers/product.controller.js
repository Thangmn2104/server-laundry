const BaseController = require('./base.controller');
const ProductService = require('../services/product.service');

class ProductController extends BaseController {
    constructor() {
        super(ProductService);
    }
}

module.exports = new ProductController();