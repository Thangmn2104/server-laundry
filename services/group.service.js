const BaseService = require('./base.service');
const group = require('../models/group.model');

class GroupService extends BaseService {
    constructor() {
        super(group);  // Kế thừa từ BaseService và truyền mô hình Item
    }

    exportUserCSV = async ()  => {
        try {
            const response = await group.find({})
            console.log(response)
        } catch (error) {
            throw new Error(error.message);
        }
        // return downloadResource(res, response)
    }
}

module.exports = new GroupService();
