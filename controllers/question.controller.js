const BaseController = require('./base.controller');
const QuestionService = require('../services/question.service');

class QuestionController extends BaseController {
    constructor() {
        super(QuestionService);  // Kế thừa từ BaseController và truyền service của Item
    }

}

module.exports = new QuestionController();
