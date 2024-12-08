const BaseService = require('./base.service');
const exam = require('../models/exam.model');
const answer = require('../models/answer.model');

class ExamService extends BaseService {
    constructor() {
        super(exam);  // Kế thừa từ BaseService và truyền mô hình Item
    }

        createExamData = async (data) => {

            const updatedData = {
                ...data,
                examData: data.examData.map(exam => ({
                    ...exam,
                    answer: exam.answer.map(ans => ({
                        ...ans,
                        isTrue: false
                    }))
                }))
            };
            const item = new exam(updatedData);
            let listCorrectAnswer = []

            data?.examData?.forEach((item) => {
                const { answer } = item
                answer.forEach((element) => {
                    if (element.isTrue === true) {
                        listCorrectAnswer.push({
                            answerId: item._id,
                            correctId: element.id

                        })
                    }
                });
            })

            const newAnswer = new answer({
                examId: item._id,
                data: [
                    ...listCorrectAnswer
                ]
            })
            await newAnswer.save()
            return await item.save();
        }
}

module.exports = new ExamService();
