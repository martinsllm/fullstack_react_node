const { convertKey } = require('../services/token');
const UserData = require('../data/UserData');

module.exports = (req, res, next) => {

    const { authorization } = req.headers;

    if(!authorization) throw new Error('Não autorizado!')

    const email = convertKey(authorization)

    const user = UserData.ListFirst({ email })
    if(!user) throw new Error('Email não encontrado!')

    next();
}