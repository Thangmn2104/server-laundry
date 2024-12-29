const BaseService = require('./base.service');
const group = require('../models/group.model');
const user = require('../models/user.model');
const XLSX = require('xlsx');
const formidable = require('formidable');
const fs = require('fs');

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

    addMember = async (req) => {
        return new Promise((resolve, reject) => {
            const form = new formidable.IncomingForm();

            form.parse(req, async (err, fields, files) => {
                if (err) {
                    console.error('Form parse error:', err);
                    return reject(new Error('Error parsing form'));
                }

                try {
                    console.log('Files received:', files); // Debug log
                    console.log('Fields received:', fields); // Debug log

                    // Sửa cách truy cập file
                    const file = Array.isArray(files.file) ? files.file[0] : files.file;
                    const groupId = Array.isArray(fields.groupId) ? fields.groupId[0] : fields.groupId;

                    if (!file) {
                        throw new Error('No file uploaded');
                    }

                    if (!groupId) {
                        throw new Error('Missing groupId');
                    }

                    // Đọc file Excel từ filepath
                    const fileData = fs.readFileSync(file.filepath || file.path);
                    const workbook = XLSX.read(fileData, { type: 'buffer' });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet);

                    // Lấy danh sách email từ file Excel
                    const emails = jsonData.map(row => row.email);

                    if (!emails.length) {
                        throw new Error('No email found in Excel file');
                    }

                    // Tìm users dựa trên email
                    const users = await user.find({ email: { $in: emails } });

                    if (!users.length) {
                        throw new Error('No matching users found');
                    }

                    const userIds = users.map(user => user._id);

                    // Cập nhật courseIds cho các users
                    const result = await user.updateMany(
                        { _id: { $in: userIds } },
                        { $addToSet: { courseIds: groupId } }
                    );

                    // Xóa file tạm sau khi xử lý xong
                    fs.unlinkSync(file.filepath || file.path);

                    resolve({
                        success: true,
                        message: `Added ${userIds.length} members to group`,
                        modifiedCount: result.modifiedCount,
                        addedUsers: users.map(u => ({ id: u._id, email: u.email }))
                    });

                } catch (error) {
                    console.error('Add member error:', error);
                    // Đảm bảo xóa file tạm nếu có lỗi
                    const filePath = files?.file?.filepath || files?.file?.[0]?.filepath || files?.file?.path || files?.file?.[0]?.path;
                    if (filePath) {
                        try {
                            fs.unlinkSync(filePath);
                        } catch (unlinkError) {
                            console.error('Error deleting temp file:', unlinkError);
                        }
                    }
                    reject(new Error(error.message));
                }
            });
        });
    }
}
module.exports = new GroupService();
