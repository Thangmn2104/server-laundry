const BaseService = require('./base.service');
const Order = require('../models/order.model');
const Counter = require('../models/counter.model');

class OrderService extends BaseService {
    constructor() {
        super(Order);
    }

    async create(data) {
        // Tạo orderId tự động
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'orderId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        const orderId = `DH${counter.seq.toString().padStart(4, '0')}`;
        
        // Tính tổng tiền từ orderItems
        const total = data.orderItems.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        const orderData = {
            ...data,
            orderId,
            total
        };

        return await this.model.create(orderData);
    }

    async updateStatus(id, status) {
        const updateData = { status };
        
        // Add completion date when status is 'completed'
        if (status === 'completed') {
            updateData.completedDate = new Date();
        }
        
        // Add cancellation date when status is 'cancelled'
        if (status === 'cancelled') {
            updateData.cancelledDate = new Date();
        }

        return await this.model.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );
    }

    async getByStatus(status) {
        return await this.model.find({ status });
    }
}

module.exports = new OrderService(); 