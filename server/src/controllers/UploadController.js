const UploadData = require('../data/UploadData')

module.exports = {

    async List(req, res, next) {
        try {
            const data = await UploadData.List();
            return res.json(data);
        } catch (error) {
            next(error)
        }
    },

    async ListByUser(req, res, next) {
        try {
            const data = await UploadData.ListByUser(req.params.id);
            return res.json(data);
        } catch (error) {
            next(error)
        }
    },

    async Create(req, res, next) {
        try {
            const url = `data:image/jpeg;base64,${req.file.buffer.toString('base64')}`;
            await UploadData.Create(req.params.id, url)
            return res.status(201).json()
        } catch (error) {
            next(error)
        }
    },

    async Update(req, res, next) {
        try {
            const url = `data:image/jpeg;base64,${req.file.buffer.toString('base64')}`;
            await UploadData.Update(req.params.id, url)
            return res.status(201).json()
        } catch (error) {
            next(error)
        }
    },
}