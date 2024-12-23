const formidable = require('formidable');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

class MediaService {

        uploadFiles = async (req) => {

        const form = new formidable.IncomingForm();

        return new Promise((resolve, reject) => {
            form.parse(req, async (err, fields, files) => {

                if (err) {
                    return reject(new Error('Error parsing the form: ' + err.message));
                }

                const file = files.file[0]; // `files.file` matches the name of the form field in your client

                if (!file) {
                   return reject(new Error('No file uploaded'));
                }
                
                try {
                    // Upload file to Cloudinary
                    const result = await cloudinary.uploader.upload(file.filepath, {
                        resource_type: 'auto', // Auto-detects the file type
                        folder: 'uploads', // Optional: organize files in a folder
                    });

                    // Remove the local file
                    fs.unlinkSync(file.filepath);

                    // Save media metadata to the database
                    resolve(result.secure_url);

                } catch (err) {
                    reject(new Error('Error uploading to Cloudinary: ' + err.message));
                }
            });
         });
    }

}

module.exports = new MediaService();
