const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

module.exports = {
    
    List: () => {
        return prisma.occurrence.findMany({
            orderBy: {
                createdAt: 'asc'
            },
            include: {
                student: {
                    select: {
                        name: true
                    }
                }
            }
        })
    },

    ListOne: async (id) => {
        const data = await prisma.occurrence.findFirst({
            where: {
                id
            },
            include: {
                article: true,
                student: {
                    select: {
                        name: true
                    }
                }
            }
        })

        if(!data) throw new Error('Resultado não encontrado!')
        return data;
    },

    ListByStudent: (id) => {
        return prisma.occurrence.findMany({
            where: {
                studentId: id
            },
            include: {
                student: {
                    select: {
                        name: true
                    }
                }
            }
        })
    },

    Create: async (params) => {
        await module.exports.ValidateFields(params, null)

        return prisma.occurrence.create({
            data: {
                ...params
            }
        })
    },

    Update: async (id, params) => {
        await module.exports.ValidateFields(params, id)

        return prisma.occurrence.update({
            where: {
                id
            },
            data: {
                ...params
            }
        })
    },

    Delete: async (id) => {
        await module.exports.ListOne(id);

        return prisma.occurrence.delete({
            where: {
                id
            }
        })
    },

    ValidateFields: async (params, id) => {
        const { text, sanction } = params;

        if(id !== null) {
            await module.exports.ListOne(id);
        }

        if(text === '' || sanction === '')
            throw new Error('Campos vazios!')
    }
}