const UserData = require('../data/UserData');

module.exports = {

    async List(req, res, next) {
        try {
            const data = await UserData.List();
            return res.json(data);
        } catch (error) {
            next(error)
        }
    },

    async ListOne(req, res, next) {
        try {
            const data = await UserData.ListOne(req.params.id);
            return res.json(data);
        } catch (error) {
            next(error)
        }
    },

    async ListByEmail(req, res, next) {
        try {
            const data = await UserData.ListByEmail(req.params.id);
            return res.json(data);
        } catch (error) {
            next(error)
        }
    },

    async Create(req, res, next) {
        try {
            await UserData.Create(req.body)
            return res.status(201).json()
        } catch (error) {
            next(error)
        }
    },

    async Update(req, res, next) {
        try {
            await UserData.Update(req.params.id, req.body);
            return res.status(204).json();
        } catch (error) {
            next(error)
        }
    },

    async Delete(req, res, next) {
        try {
            await UserData.Delete(req.params.id)
            return res.status(204).json()
        } catch (error) {
            next(error)
        }
    },
}