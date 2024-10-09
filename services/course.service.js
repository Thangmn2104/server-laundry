const BaseService = require('./base.service');
const course = require('../models/course.model');

class CourseService extends BaseService {
    constructor() {
        super(course);  // Kế thừa từ BaseService và truyền mô hình Item
    }
}

module.exports = new CourseService();
