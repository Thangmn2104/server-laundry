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
        const { sort = { createdAt: -1 } } = query;
        delete query.sort
        const rows = await this.model.find(query)
            .sort(typeof sort === 'string' ? JSON.parse(sort) : sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        const count = await this.model.countDocuments(query);

        return {
            rows,
            total: count,
            page,
            pageSize: limit,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        };
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
