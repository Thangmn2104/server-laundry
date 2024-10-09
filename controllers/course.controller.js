const BaseController = require('./base.controller');
const CourseService = require('../services/course.service');

class CourseController extends BaseController {
    constructor() {
        super(CourseService);  // Kế thừa từ BaseController và truyền service của Item
    }
}

module.exports = new CourseController();
