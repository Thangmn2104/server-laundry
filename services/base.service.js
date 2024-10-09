class BaseService {
    constructor(model) {
        this.model = model;
    }

    // Create
    async create(data) {
        const item = new this.model(data);
        return await item.save();
    }

    // Get all with pagination
    async getAll(query = {}, page = 1, limit = 10) {
        const rows = await this.model.find(query)
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

    // Get by ID
    async getById(id) {
        return await this.model.findById(id);
    }

    // Update
    async update(id, data) {
        return await this.model.findByIdAndUpdate(id, data, { new: true });
    }

    // Delete
    async delete(id) {
        return await this.model.findByIdAndDelete(id);
    }
}

module.exports = BaseService;
