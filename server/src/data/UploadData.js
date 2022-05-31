const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

module.exports = {

    List: () => {
        return prisma.photo.findMany()
    },

    ListOne: async (id) => {
        const data = await prisma.photo.findFirst({
            where: {
                id
            }
        })

        if(!data) throw new Error('Resultado não encontrado!')
        return data
    },

    Create: (id, url) => {
        return prisma.photo.create({
            data: {
                url,
                studentId: id
            }
        })
    },

    Update: async (id, url) => {
        await module.exports.ListOne(id)

        return prisma.photo.update({
            where: {
               id
            },
            data: {
                url
            }
        })
    },
}