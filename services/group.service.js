const BaseService = require('./base.service');
const group = require('../models/group.model');

class GroupService extends BaseService {
    constructor() {
        super(group);  // Kế thừa từ BaseService và truyền mô hình Item
    }
}

module.exports = new GroupService();
