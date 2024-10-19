const MediaService = require('../services/media.service')


class MediaController {
    uploadFiles = async (req, res) => {
        try {
            const result = await MediaService.uploadFiles(req)
            res.status(200).json({ url: result})
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
}

module.exports = new MediaController();


