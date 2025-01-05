const mongoose = require('mongoose');
const moment = require('moment-timezone');

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
});

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        unique: true
    },
    customerName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    total: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
    completedDate: {
        type: String,
        default: null
    },
    cancelledDate: {
        type: String,
        default: null
    },
    note: {
        type: String,
        required: false
    },
    orderItems: [orderItemSchema]
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order; 