const StudentData = require('../data/StudentData')

module.exports = {

    async List(req, res, next) {
        try {
            const data = await StudentData.List()
            return res.json(data)
        } catch (error) {
            next(error)
        }
    },

    async ListOne(req, res, next) {
        try {
            const data = await StudentData.ListOne(req.params.id)
            return res.json(data)
        } catch (error) {
            next(error)
        }
    },

    async Search(req, res, next) {
        try {
            const data = await StudentData.Search(req.params.id)
            return res.json(data)
        } catch (error) {
            next(error)
        }
    },

    async Create(req, res, next) {
        try {
            const data = await StudentData.Create(req.body)
            return res.json(data)
        } catch (error) {
            next(error)
        }
    },

    async Update(req, res, next) {
        try {
            await StudentData.Update(req.params.id, req.body)
            return res.status(204).json()
        } catch (error) {
            next(error)
        }
    },

    async Delete(req, res, next) {
        try {
            await StudentData.Delete(req.params.id)
            return res.status(204).json()
        } catch (error) {
            next(error)
        }
    },
}