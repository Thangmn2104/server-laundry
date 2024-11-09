const BaseController = require('./base.controller');
const ChapterService = require('../services/chapter.service');

class ChapterController extends BaseController {
    constructor() {
        super(ChapterService);  // Kế thừa từ BaseController và truyền service của Item
    }
}

module.exports = new ChapterController();
