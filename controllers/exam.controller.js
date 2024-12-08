const BaseController = require('./base.controller');
const ExamService = require('../services/exam.service');

class ExamController extends BaseController {
    constructor() {
        super(ExamService);  // Kế thừa từ BaseController và truyền service của Item
    }

    createExamData = async (req, res) => {
        try {
            const item = await ExamService.createExamData(req.body);
            res.status(201).json(item);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

}

module.exports = new ExamController();
