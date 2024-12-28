const BaseService = require('./base.service');
const exam = require('../models/exam.model');
const answer = require('../models/answer.model');

class ExamService extends BaseService {
    constructor() {
        super(exam);  // Kế thừa từ BaseService và truyền mô hình Item
    }

        async getAllExam(query = {}, page = 1, limit = 10) {
            const { sort = { createdAt: -1 }, role = '', studentId = '' } = query;
            const cloneRole = role;
            delete query.sort;
            delete query.role;
            delete query.studentId;

            const rows = await this.model.find(query)
                .sort(typeof sort === 'string' ? JSON.parse(sort) : sort)
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec();
            const count = await this.model.countDocuments(query);

            if (cloneRole === 'student') {
                // Lọc ra các bài thi có examIdCore và thuộc về student hiện tại
                const studentExams = rows.filter(exam => 
                    exam.examIdCore && exam.studentId === studentId
                );
                
                // Tạo map với các bài thi gốc (không có examIdCore)
                const examMap = new Map(
                    rows
                        .filter(exam => !exam.examIdCore)
                        .map(exam => [exam._id.toString(), exam])
                );
                
                // Thêm các bài thi của student hiện tại vào map
                studentExams.forEach(studentExam => {
                    examMap.delete(studentExam.examIdCore.toString());
                    examMap.set(studentExam._id.toString(), studentExam);
                });
                
                return {
                    rows: Array.from(examMap.values()),
                    total: count,
                    page,
                    pageSize: limit,
                    totalPages: Math.ceil(count / limit),
                    currentPage: page,
                };
            }

            return {
                rows,
                total: count,
                page,
                pageSize: limit,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
            };
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

        createStudentExamData = async (data) => {
            const {studentExamData, userAnswers} = data;
            const cloneStudentData = {...studentExamData};
            delete cloneStudentData._id;

            // Lấy đáp án đúng từ DB
            const correctAnswers = await answer.findOne({ examId: studentExamData._id });
            if (!correctAnswers) {
                throw new Error('Không tìm thấy đáp án cho bài kiểm tra này');
            }

            // Tính điểm và đánh dấu câu trả lời đúng/sai
            let correctCount = 0;
            const totalQuestions = correctAnswers.data.length; // Tổng số câu hỏi

            userAnswers?.data?.forEach(userAns => {
                // Tìm đáp án đúng tương ứng
                const correctAns = correctAnswers.data.find(
                    ans => ans.answerId === userAns.answerId
                );

                // Kiểm tra câu trả lời
                const isCorrect = correctAns && correctAns.correctId === userAns.correctId;
                
                // Đếm số câu đúng
                if (isCorrect) {
                    correctCount++;
                }
            });

            // Tính điểm theo thang điểm 10
            const totalScore = (correctCount / totalQuestions) * 10;

            // Tạo bài thi mới cho học sinh
            const studentExam = new exam({
                ...cloneStudentData,
                totalScore: Math.round(totalScore * 100) / 100, // Làm tròn đến 2 chữ số thập phân
                examIdCore: studentExamData._id
            });

            const studentAnswersData = new answer({
                ...userAnswers,
                examId: studentExam._id,
                studentId: studentExam.studentId,
            });

            await studentAnswersData.save();
            await studentExam.save();

            return { message: 'Nộp bài thành công' };
        }

        updateStudentExamData = async (examIdCore, data) => {
            delete data?._id;
            
            // Update exam gốc
            await exam.updateOne(
                { _id: examIdCore },
                data,
                { new: true }
            );

            // Update các exam của student với việc giữ nguyên các field quan trọng
            return await exam.updateMany(
                { examIdCore: examIdCore },
                [  // Sử dụng array để chỉ định pipeline
                    {
                        $set: {
                            ...data,
                            examIdCore: examIdCore,
                            totalScore: {
                                $cond: {
                                    if: { $gt: ["$totalScore", null] },
                                    then: "$totalScore",
                                    else: 0
                                }
                            },
                            studentId: {
                                $cond: {
                                    if: { $gt: ["$studentId", null] },
                                    then: "$studentId",
                                    else: null
                                }
                            },
                            userId: {
                                $cond: {
                                    if: { $gt: ["$userId", null] },
                                    then: "$userId",
                                    else: null
                                }
                            },
                            submittedTime: {
                                $cond: {
                                    if: { $gt: ["$submittedTime", null] },
                                    then: "$submittedTime",
                                    else: null
                                }
                            },
                            createdAt: {
                                $cond: {
                                    if: { $gt: ["$createdAt", null] },
                                    then: "$createdAt",
                                    else: "$$NOW"
                                }
                            }
                        }
                    }
                ],
                { new: true }
            );
        }
}

module.exports = new ExamService();
