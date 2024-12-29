const BaseService = require('./base.service');
const group = require('../models/group.model');
const user = require('../models/user.model');

class GroupService extends BaseService {
    constructor() {
        super(group);  // Kế thừa từ BaseService và truyền mô hình Item
    }

    exportUserCSV = async ()  => {
        try {
            const response = await group.find({})
            console.log(response)
        } catch (error) {
            throw new Error(error.message);
        }
        // return downloadResource(res, response)
    }

   getUserListCourse = async (query) => {
    try {
        const data = await group.aggregate([
            { 
                $match: query // Tìm các khóa học theo teacherData.userId
            },
            {
                $group: {
                    _id: "$courseData", // Nhóm theo courseData để loại bỏ khóa học trùng lặp
                }
            },
            {
                $replaceRoot: {
                    newRoot: "$_id" // Thay thế root của tài liệu bằng courseData
                }
            },
            {
                $project: {
                    _id: 0, // Ẩn trường _id mặc định
                }
            }
        ]);
        return data;
    } catch (error) {
        console.error(error);
        throw new Error("An error occurred while fetching unique courseData");
    }
    }

    deleteMember = async (groupId, userIds) => {
        try {
            const userIdArray = Array.isArray(userIds) ? userIds : [userIds];
            
            // Xóa groupId khỏi courseIds của nhiều user
            await user.updateMany(
                { _id: { $in: userIdArray } },
                { $pull: { courseIds: groupId } }
            );
            
            // Xóa bản ghi trong collection group cho nhiều user
            const data = await group.deleteMany({
                groupId, 
                userId: { $in: userIdArray }
            });
            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
module.exports = new GroupService();
