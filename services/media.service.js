const formidable = require('formidable');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

class MediaService {
    /**
     * Upload file lên Cloudinary
     * @param {Request} req - Yêu cầu từ client
     * @returns {Promise<object>} - Đối tượng chứa thông tin URL và loại file
     */
uploadFiles = async (req) => {
    const form = new formidable.IncomingForm();

    return new Promise((resolve, reject) => {
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return reject(new Error('Error parsing the form: ' + err.message));
            }

            const file = Array.isArray(files.file) ? files.file[0] : files.file;
            if (!file) {
                return reject(new Error('No file uploaded'));
            }

            try {
                // Xác định loại tài nguyên và tên file
                const resourceType = this.getResourceType(file.mimetype);
                const fileExtension = file.originalFilename.split('.').pop(); // Lấy đuôi file

                // Upload file lên Cloudinary
                const result = await cloudinary.uploader.upload(file.filepath, {
                    resource_type: resourceType,
                    folder: 'uploads',
                });

                // Xóa file tạm
                fs.unlinkSync(file.filepath);

                // Nếu là tài liệu (raw), thêm đuôi file vào URL trả về
                const fileUrl = resourceType === 'raw' ? `${result.secure_url}.${fileExtension}` : result.secure_url;

                // Trả về URL và loại file
                resolve({
                    url: fileUrl,    // URL trả về từ Cloudinary với đuôi file
                    type: fileExtension, // Đuôi file
                });
            } catch (err) {
                reject(new Error('Error uploading to Cloudinary: ' + err.message));
            }
        });
    });
};


    /**
     * Xác định loại file dựa trên MIME type
     * @param {string} mimetype - MIME type của file
     * @returns {string} - Loại tài nguyên cho Cloudinary
     */
    getResourceType = (mimetype) => {
        if (mimetype.startsWith('video/')) {
            return 'video'; // Video
        } else if (
            mimetype === 'application/pdf' || // PDF
            mimetype === 'application/msword' || // DOC
            mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // DOCX
        ) {
            return 'raw'; // Tài liệu
        }
        return 'image'; // Mặc định là hình ảnh
    };
}

module.exports = new MediaService();
