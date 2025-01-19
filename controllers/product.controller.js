const BaseController = require('./base.controller');
const ProductService = require('../services/product.service');

class ProductController extends BaseController {
    constructor() {
        super(ProductService);
    }

    importProducts = async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'Please upload a file' });
            }

            const result = await this.service.importProducts(req.file);
            res.status(200).json({
                message: 'Products imported successfully',
                data: result
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error importing products',
                error: error.message
            });
        }
    }

    pin = async (req, res) => {
        const { productId, isPinned } = req.body;
        const result = await ProductService.updatePinned(productId, isPinned);
        res.status(200).json({
            message: 'Product pinned successfully',
            data: result
        });
    }
}

module.exports = new ProductController();