const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {

    generateHash: async (password) => {
        return await bcrypt.hash(password, saltRounds).then(hash => {
            return hash
        })
    },

    checkPassword: async (password, hash) => {
        return await bcrypt.compare(password, hash);
    }
}