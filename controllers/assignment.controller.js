const BaseController = require('./base.controller');
const AssignmentService = require('../services/assignment.service');

class AssignmentController extends BaseController {
    constructor() {
        super(AssignmentService);  // Kế thừa từ BaseController và truyền service của Item
    }
}

module.exports = new AssignmentController();
