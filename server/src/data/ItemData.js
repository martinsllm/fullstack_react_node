const convert = require("tc-roman-number")
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

module.exports = {

    List: () => {
        return prisma.item.findMany()
    },

    ListOne: async (id) => {
        const data = await prisma.item.findFirst({
            where: {
                id
            }
        })

        if(!data) throw new Error('Resultado não encontrado!')
        return data;
    },

    Create: async (params) => {
        const { number } = params
        await module.exports.ValidateFields(params, null)

        return prisma.item.create({
            data: {
                ...params,
                numberRoman: convert.intToRoman(Number(number))
            }
        })
    },

    Update: async (id, params) => {
        const { number } = params
        await module.exports.ValidateFields(params, id)

        return prisma.item.update({
            where: {
                id
            },
            data: {
                ...params,
                numberRoman: convert.intToRoman(Number(number))
            }
        })
    },

    Delete: async (id) => {
        await module.exports.ListOne(id)

        return prisma.item.delete({
            where: {
                id
            }
        })
    },

    ValidateFields: async (params, id) => {
        const { number, text, articleId } = params

        if(id !== null) {
            await module.exports.ListOne(id)
        }

        if(number === '' || text === '' || articleId === '')
            throw new Error('Um ou mais campos vazios!')
    }
}

