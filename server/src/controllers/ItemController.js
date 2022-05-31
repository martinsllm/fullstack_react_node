const ItemData = require('../data/ItemData')

module.exports = {

    async List(req, res, next) {
        try {
            const data = await ItemData.List();
            return res.json(data)
        } catch (error) {
            next(error)
        }
    },

    async ListOne(req, res, next) {
        try {
            const data = await ItemData.ListOne(req.params.id);
            return res.json(data)
        } catch (error) {
            next(error)
        }
    },

    async Create(req, res, next) {
        try {
            await ItemData.Create(req.body)
            return res.status(201).json()
        } catch (error) {
            next(error)
        }
    },

    async Update(req, res, next) {
        try {
            await ItemData.Update(req.params.id, req.body)
            return res.status(204).json()
        } catch (error) {
            next(error)
        }
    },

    async Delete(req, res, next) {
        try {
            await ItemData.Delete(req.params.id)
            return res.status(204).json()
        } catch (error) {
            next(error)
        }
    },
}