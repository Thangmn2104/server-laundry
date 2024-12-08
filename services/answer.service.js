const BaseService = require('./base.service');
const answer = require('../models/answer.model');

class AnswersService extends BaseService {
    constructor() {
        super(answer);  // Kế thừa từ BaseService và truyền mô hình Item
    }

}

module.exports = new AnswersService();
