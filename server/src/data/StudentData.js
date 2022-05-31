const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

module.exports = {

    List: () => {
        return prisma.student.findMany({
            orderBy: {
                name: 'asc'
            }
        })
    },

    ListOne: async (id) => {
        const data = await prisma.student.findUnique({
            where: {
                id
            },
            include: {
                class: {
                    select: {
                        name: true
                    }
                },
                photo: true,
                occurrence: true
            }
        })

        if(!data) throw new Error('Resultado não encontrado!')
        return data
    },

    Search: (params) => {
        return prisma.student.findMany({
            where: {
                name: {
                    contains: params,
                    mode: 'insensitive'
                }
            }
        })
    },

    Create: async (params) => {
        await module.exports.ValidateFields(params, null)

        return prisma.student.create({
            data: {
                ...params
            }
        })
    },

    Update: async (id, params) => {
        await module.exports.ValidateFields(params, id)

        return prisma.student.update({
            where: {
                id
            },
            data: {
                ...params
            }
        })
    },

    Delete: async (id) => {
        return prisma.student.delete({
            where: {
                id
            }
        })
    },

    ValidateFields: async (params, id) => {
        const { name, dataNascimento, classId } = params

        if(id !== null) {
            await module.exports.ListOne(id)
        }

        if(name === '' || dataNascimento === '' || classId === '')
            throw new Error('Um ou mais campos vazios!')
    }
}