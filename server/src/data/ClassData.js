const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {

    List: () => {
        return prisma.class.findMany({
            orderBy: {
                name: 'asc'
            }
        })
    },

    ListOne: async (id) => {
        const data = await prisma.class.findFirst({
            where: {
                id
            },
            include: {
                students: {
                   select: {
                        id: true,
                        name: true,
                        registration: true
                   },
                   orderBy: {
                       name: 'asc'
                   }
                }
            }
        })

        if(!data) throw new Error('Resultado não encontrado!')
        return data
    },

    Create: async (params) => {
        await module.exports.ValidateFields(params)

        return prisma.class.create({
            data: {
                ...params
            }
        })
    },

    Update: async (id, params) => {
        await module.exports.ValidateFields(params, id)

        return prisma.class.update({
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

        return prisma.class.delete({
            where: {
                id
            }
        })
    },

    ValidateFields: async (params) => {
        const { name } = params;

        if(name === '') 
            throw new Error('Um ou mais campos vazios!')
    }
}