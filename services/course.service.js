const BaseService = require('./base.service');
const course = require('../models/course.model');
const { downloadResource } = require('../utils')

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
}

module.exports = new CourseService();
