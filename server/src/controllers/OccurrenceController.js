const OccurrenceData = require('../data/OccurrenceData');

module.exports = {
    
    async List(req, res, next) {
        try {
            const data = await OccurrenceData.List();
            return res.json(data)
        } catch (error) {
            next(error)
        }
    },

    async ListOne(req, res, next) {
        try {
            const data = await OccurrenceData.ListOne(req.params.id);
            return res.json(data)
        } catch (error) {
            next(error)
        }
    },

    async ListByStudent(req, res, next) {
        try {
            const data = await OccurrenceData.ListByStudent(req.params.id);
            return res.json(data)
        } catch (error) {
            next(error)
        }
    },

    async Create(req, res, next) {
        try {
            await OccurrenceData.Create(req.body)
            return res.status(201).json()
        } catch (error) {
            next(error)
        }
    },

    async Update(req, res, next) {
        try {
            await OccurrenceData.Update(req.params.id, req.body)
            return res.status(204).json()
        } catch (error) {
            next(error)
        }
    },

    async Delete(req, res, next) {
        try {
            await OccurrenceData.Delete(req.params.id)
            return res.status(204).json()
        } catch (error) {
            next(error)
        }
    },

}