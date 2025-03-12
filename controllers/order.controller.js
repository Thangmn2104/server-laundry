const BaseController = require('./base.controller');
const OrderService = require('../services/order.service');

class OrderController extends BaseController {
    constructor() {
        super(OrderService);
    }

    createOrder = async (req, res) => {
        try {
            const result = await OrderService.createOrder(req.body, req.user._id);
            res.json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    getAllOrders = async (req, res) => {
        try {
            const { page = 1, limit = 10, query = {} } = req.query;
            const result = await OrderService.getAllOrders(query ?? {}, page, limit, req.user._id);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
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

    // Get by ID
    getOrderById = async (req, res) => {
        try {
            const id = req.params.id
            const userId = req.user._id;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'Invalid ID format' });
            }

            const item = await OrderService.getOrderById(id, userId);
            if (!item) return res.status(404).json({ message: 'Item not found' });
            res.json(item);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Update by ID
    updateOrder = async (req, res) => {
        try {
            const id = req.params.id;
            const userId = req.user._id;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'Invalid ID format' });
            }
            const item = await OrderService.updateOrder(id, userId, req.body);
            if (!item) return res.status(404).json({ message: 'Item not found' });
            res.json(item);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Delete by ID
    deleteOrder = async (req, res) => {
        try {
            const id = req.params.id;
            const userId = req.user._id;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'Invalid ID format' });
            }
            const item = await OrderService.deleteOrder(id, userId);
            if (!item) return res.status(404).json({ message: 'Item not found' });
            res.json({ message: 'Item deleted' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new OrderController(); 