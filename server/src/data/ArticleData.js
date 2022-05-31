const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

module.exports = {

    List: () => {
        return prisma.article.findMany({
            orderBy: {
                number: 'asc'
            }
        });
    },

    ListOne: async (id) => {
        const data = await prisma.article.findFirst({
            where: {
                id
            },
            include: {
                item: {
                    select: {
                        id: true,
                        numberRoman: true,
                        text: true
                    },
                    orderBy: {
                        number: 'asc'
                    }
                }
            }
        })

        if(!data) throw new Error('Resultado não encontrado!')
        return data;
    },

    Create: async (params) => {
        await module.exports.ValidateFields(params, null)

        return prisma.article.create({
            data: {
                ...params
            }
        })
    },

    Update: async (id, params) => {
        await module.exports.ValidateFields(params, id)

        return prisma.article.update({
            where: {
                id
            },
            data: {
                ...params
            }
        })
    },

    Delete: async (id) => {
        await module.exports.ListOne(id)

        return prisma.article.delete({
            where: {
                id
            }
        })
    },

    ValidateFields: async (params, id) => {
        const { number, text } = params

        if(id != null) {
            await module.exports.ListOne(id)
        }

        if(number === '' || text === '')
            throw new Error('Um ou mais campos vazios!')
    }


}