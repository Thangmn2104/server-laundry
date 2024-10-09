const BaseController = require('./base.controller');
const itemService = require('../services/item.service');

class ItemController extends BaseController {
    constructor() {
        super(itemService);  // Kế thừa từ BaseController và truyền service của Item
    }
}

module.exports = new ItemController();
