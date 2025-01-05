const mongoose = require('mongoose');
const { downloadResource} = require('../utils')

class BaseService {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        const item = new this.model(data);
        return await item.save();
    }

    async getAll(query = {}, page = 1, limit = 10) {
        try {
            page = parseInt(page);
            limit = parseInt(limit);

            let { sort, ...searchQuery } = query;

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

    async getById(id) {
        return await this.model.findById(id);
    }

    async update(_id, data) {
        return await this.model.findByIdAndUpdate(_id, data, { new: true });
    }

    async delete(id) {
        return await this.model.findByIdAndDelete(id);
    }


}

module.exports = BaseService;
