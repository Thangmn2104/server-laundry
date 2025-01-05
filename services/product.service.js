const BaseService = require('./base.service');
const Product = require('../models/product.model');
const Counter = require('../models/counter.model');
const XLSX = require('xlsx');
const fs = require('fs');
const crypto = require('crypto');

class ProductService extends BaseService {
    constructor() {
        super(Product);
    }

    async create(data) {
        // Lấy và tăng counter
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'productId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        // Tạo productId với format SP + số (padding với 0)
        const productId = `SP${counter.seq.toString().padStart(4, '0')}`;
        
        // Thêm productId vào data
        const productData = {
            ...data,
            productId
        };

        // Tạo sản phẩm mới
        return await this.model.create(productData);
    }

    removeMany(ids) {
        return this.model.deleteMany({ _id: { $in: ids } });
    }

    generateProductId() {
        // Tạo ID ngẫu nhiên 8 ký tự
        return crypto.randomBytes(4).toString('hex');
    }

    async importProducts(file) {
        if (!file || !file.buffer) {
            throw new Error('No file uploaded');
        }

        try {
            // Read from buffer instead of file
            const workbook = XLSX.read(file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);

            // Validate và chuẩn hóa dữ liệu
            const validatedData = data.map(item => ({
                productId: item.productId || this.generateProductId(),
                name: item.name,
                price: Number(item.price),
                category: item.category,
                quantity: Number(item.quantity) || 1,
                description: item.description || '',
                status: item.status || 'active'
            }));

            const result = await Promise.all(
                validatedData.map(async (item) => {
                    const existingProduct = await this.model.findOne({ productId: item.productId });

                    if (existingProduct) {
                        return await this.model.findByIdAndUpdate(
                            existingProduct._id,
                            item,
                            { new: true }
                        );
                    } else {
                        return await this.model.create(item);
                    }
                })
            );

            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ProductService();
