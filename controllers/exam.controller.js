const BaseController = require('./base.controller');
const ExamService = require('../services/exam.service');

class ExamController extends BaseController {
    constructor() {
        super(ExamService);  // Kế thừa từ BaseController và truyền service của Item
    }

    getAllExam = async (req, res) => {
        try {
            const { page = 1, limit = 10, query = {}} = req.query;
            console.log(query)
            const result = await this.service.getAllExam(query ?? {}, page, limit);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    createExamData = async (req, res) => {
        try {
            const item = await ExamService.createExamData(req.body);
            res.status(201).json(item);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    createStudentExamData = async (req, res) => {
        try {
            const item = await ExamService.createStudentExamData(req.body);
            res.status(201).json(item);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    updateStudentExamData = async (req, res) => {
        try {
            const item = await ExamService.updateStudentExamData(req.params.id, req.body);
            if (!item) return res.status(404).json({ message: 'Item not found' });
            res.json(item);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

}

module.exports = new ExamController();
