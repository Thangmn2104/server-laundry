const BaseService = require('./base.service');
const course = require('../models/course.model');
const { downloadResource } = require('../utils')
const xlsx = require('xlsx');

class CourseService extends BaseService {
    constructor() {
        super(course);  // Kế thừa từ BaseService và truyền mô hình Item
    }

    exportUserCSV = async (res)  => {
    try {
        const response = await course.find({})

        const fields = [
            {
                label: 'Tên học phần',
                value: 'title'
            },
            {
                label: 'Mã học phần',
                value: 'courseId'
            },
            {
                label: 'Mô tả học phần',
                value: 'description'
            }
        ];
        
        return downloadResource(res, 'userData.csv', fields ,response)
    } catch (error) {
        throw new Error(error.message);
    }
    // return downloadResource(res, response)
}

    importCourse = async (file) => {
        try {
            if (!file) {
                throw new Error('No file uploaded');
            }

            const workbook = xlsx.read(file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(worksheet);

            const courses = data.map(row => ({
                title: row['title'],
                courseId: row['courseId'],
                description: row['description'],
                groupIds: [] // Default empty array for groupIds
            }));

            const result = await course.insertMany(courses);
            return { message: `Imported ${result.length} courses successfully` };
        } catch (error) {
            throw new Error(`Import failed: ${error.message}`);
        }
    }

    deleteMany = async (courseIds) => {
        try {
            if (!Array.isArray(courseIds) || courseIds.length === 0) {
                throw new Error('courseIds phải là một mảng và không được rỗng');
            }

            const result = await course.deleteMany({ _id: { $in: courseIds } });
            
            if (result.deletedCount === 0) {
                throw new Error('Không tìm thấy khóa học nào để xóa');
            }

            return {
                message: `Đã xóa thành công ${result.deletedCount} khóa học`,
                deletedCount: result.deletedCount
            };
        } catch (error) {
            throw new Error(`Xóa thất bại: ${error.message}`);
        }
    }
}

module.exports = new CourseService();
