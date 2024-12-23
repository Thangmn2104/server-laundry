const BaseController = require('./base.controller');
const NotificationService = require('../services/notification.service');

class NotificationController extends BaseController {
    constructor() {
        super(NotificationService);  // Kế thừa từ BaseController và truyền service của Item
    }

}

module.exports = new NotificationController();
