const BaseController = require('./base.controller');
const CourseService = require('../services/course.service');

class CourseController extends BaseController {
    constructor() {
        super(CourseService);  // Inherit from BaseController and pass in the CourseService
    }

    exportUserCSV = async (req, res) => {
        try {
            await CourseService.exportUserCSV(res); // Ensure this handles the response
        } catch (error) {
            if (!res.headersSent) {  // Check if headers were not already sent
                res.status(400).json({ message: error.message });
            }
        }
    }

    importCourse = async (req, res) => {
        try {
            const result = await CourseService.importCourse(req.file);
            res.status(200).json(result);
        } catch (error) {
            if (!res.headersSent) {
                res.status(400).json({ message: error.message });
            }
        }
    }

    deleteMany = async (req, res) => {
        try {
            const { courseIds } = req.body;
            const result = await CourseService.deleteMany(courseIds);
            res.status(200).json(result);
        } catch (error) {
            if (!res.headersSent) {
                res.status(400).json({ message: error.message });
            }
        }
    }
}

module.exports = new CourseController();
