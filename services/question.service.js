const BaseService = require('./base.service');
const question = require('../models/question.model');

class QuestionService extends BaseService {
    constructor() {
        super(question);  // Kế thừa từ BaseService và truyền mô hình Item
    }

}

module.exports = new QuestionService();
