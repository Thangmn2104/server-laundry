const BaseController = require('./base.controller');
const AnswerService = require('../services/answer.service');

class AnswerController extends BaseController {
    constructor() {
        super(AnswerService);  // Kế thừa từ BaseController và truyền service của Item
    }

}

module.exports = new AnswerController();
