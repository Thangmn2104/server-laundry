const BaseService = require('./base.service');
const notification = require('../models/notification.model');

class NotificationService extends BaseService {
    constructor() {
        super(notification);  // Kế thừa từ BaseService và truyền mô hình Item
    }

}

module.exports = new NotificationService();
