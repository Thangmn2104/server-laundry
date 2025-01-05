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
        try {
            const workbook = XLSX.readFile(file.path);
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
                    // Tìm sản phẩm theo productId
                    const existingProduct = await this.model.findOne({ productId: item.productId });

                    if (existingProduct) {
                        // Nếu sản phẩm đã tồn tại, cập nhật thông tin
                        return await this.model.findByIdAndUpdate(
                            existingProduct._id,
                            item,
                            { new: true }
                        );
                    } else {
                        // Nếu sản phẩm chưa tồn tại, tạo mới
                        return await this.model.create(item);
                    }
                })
            );

            // Xóa file sau khi xử lý xong
            fs.unlinkSync(file.path);

            return result;
        } catch (error) {
            // Đảm bảo xóa file nếu có lỗi
            if (file.path && fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
            throw error;
        }
    }
}

module.exports = new ProductService();
