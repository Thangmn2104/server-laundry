const BaseController = require('./base.controller');
const GroupService = require('../services/group.service');

class GroupController extends BaseController {
    constructor() {
        super(GroupService);  // Kế thừa từ BaseController và truyền service của Item
    }

    exportUserCSV = async (req, res) => {
        try {
            const result = await GroupService.exportUserCSV();
            res.json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new GroupController();
