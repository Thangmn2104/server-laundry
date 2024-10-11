const BaseService = require('./base.service');
const assignment = require('../models/assignment.model');

class AssignmentService extends BaseService {
    constructor() {
        super(assignment);  // Kế thừa từ BaseService và truyền mô hình Item
    }
}

module.exports = new AssignmentService();
