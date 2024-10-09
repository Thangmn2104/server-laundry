class BaseController {
    constructor(service) {
        this.service = service;
    }

    // Create
    create = async (req, res) => {
        try {
            const item = await this.service.create(req.body);
            res.status(201).json(item);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Get all with pagination
    getAll = async (req, res) => {
        try {
            const { page = 1, limit = 10 } = req.query;
            const result = await this.service.getAll({}, page, limit);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get by ID
    getById = async (req, res) => {
        try {
            const item = await this.service.getById(req.params.id);
            if (!item) return res.status(404).json({ message: 'Item not found' });
            res.json(item);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Update by ID
    update = async (req, res) => {
        try {
            const item = await this.service.update(req.params.id, req.body);
            if (!item) return res.status(404).json({ message: 'Item not found' });
            res.json(item);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Delete by ID
    delete = async (req, res) => {
        try {
            const item = await this.service.delete(req.params.id);
            if (!item) return res.status(404).json({ message: 'Item not found' });
            res.json({ message: 'Item deleted' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = BaseController;