const BaseService = require('./base.service');
const chapter = require('../models/chapter.model');

class ChapterService extends BaseService {
    constructor() {
        super(chapter);  // Kế thừa từ BaseService và truyền mô hình Item
    }
}

module.exports = new ChapterService();
