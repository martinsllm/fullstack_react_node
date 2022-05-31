module.exports = {

    generateKey: (params) => {
        return Buffer.from(params).toString('base64');
    },

    convertKey: (params) => {
        return Buffer.from(params, 'base64').toString();
    }

}