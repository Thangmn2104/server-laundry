const BaseService = require('./base.service');
const Order = require('../models/order.model');
const Counter = require('../models/counter.model');

class OrderService extends BaseService {
    constructor() {
        super(Order);
    }

    async createOrder(data, userId) {
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
            total,
            userId
        };

        return await this.model.create(orderData);
    }

    async getAllOrders(query = {}, page = 1, limit = 10, userId) {
        try {
            page = parseInt(page);
            limit = parseInt(limit);

            let { sort, ...searchQuery } = query;

            // Add userId filter if provided
            if (userId) {
                searchQuery.userId = userId;
            }

            const defaultSort = { createdAt: -1, _id: -1 };

            if (!sort) {
                sort = defaultSort;
            } else if (typeof sort === 'string') {
                try {
                    sort = JSON.parse(sort);
                    sort = { ...sort, _id: -1 };
                } catch (e) {
                    sort = defaultSort;
                }
            }

            const skip = (page - 1) * limit;
            const safeSkip = Math.max(0, skip);

            const [rows, total] = await Promise.all([
                this.model.find(searchQuery)
                    .sort(sort)
                    .skip(safeSkip)
                    .limit(limit)
                    .lean()
                    .exec(),
                this.model.countDocuments(searchQuery)
            ]);

            return {
                rows,
                total,
                page,
                pageSize: limit,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            };
        } catch (error) {
            throw error;
        }
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

    async getOrderById(id, userId) {
        return await this.model.findOne({ _id: id, userId });
    }

    async updateOrder(_id, userId, data) {
        return await this.model.findOneAndUpdate({ _id, userId }, data, { new: true });
    }

    async deleteOrder(id, userId) {
        return await this.model.findOneAndDelete({ _id: id, userId });
    }

}

module.exports = new OrderService(); 