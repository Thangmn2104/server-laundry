const BaseService = require('./base.service');
const Item = require('../models/item.model');

class ItemService extends BaseService {
    constructor() {
        super(Item);  // Kế thừa từ BaseService và truyền mô hình Item
    }
}

module.exports = new ItemService();
