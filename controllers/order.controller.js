const BaseController = require('./base.controller');
const OrderService = require('../services/order.service');

class OrderController extends BaseController {
    constructor() {
        super(OrderService);
    }

    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const result = await OrderService.updateStatus(id, status);
            res.json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getByStatus(req, res) {
        try {
            const { status } = req.params;
            const result = await OrderService.getByStatus(status);
            res.json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new OrderController(); 