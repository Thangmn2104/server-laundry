const BaseController = require('./base.controller');
const GroupService = require('../services/group.service');

class GroupController extends BaseController {
    constructor() {
        super(GroupService);  // Kế thừa từ BaseController và truyền service của Item
    }
}

module.exports = new GroupController();
