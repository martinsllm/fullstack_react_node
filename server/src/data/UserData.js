const { generateHash } = require('../services/bcrypt')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

module.exports = {
    
    List: () => {
        return prisma.user.findMany({
            orderBy: {
                'name': 'asc'
            }
        })
    },

    ListOne: async (id) => {
        const data = await prisma.user.findFirst({
            where: {
                id
            }
        })

        if(!data) throw new Error('Resultado não encontrado!')
        return data
    },

    ListByEmail: async (email) => {
        const data = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if(!data) throw new Error('Resultado não encontrado!')
        return data
    },

    ListFirst: async (params) => {
        const data = await prisma.user.findFirst({
            where: {
                ...params
            }
        })

        if(!data) throw new Error('Resultado não encontrado!')
        return data
    },

    Create: async (params) => {
        await module.exports.ValidateFields(params, null)

        return prisma.user.create({
            data: {
                ...params,
                password: await generateHash(params.password),
                permission: false
            }
        })
    },

    Update: async (id, params) => {
        await module.exports.ValidateFields(params, id)

        return prisma.user.update({
            where: {
                id
            }, 
            data: {
                ...params
            }
        })
    },

    UpdatePassword: async (params) => {
        const { email, password } = params;

        await module.exports.ValidateFields(params, null)

        return prisma.user.updateMany({
            where: {
                email
            }, 
            data: {
                password: await generateHash(password)
            }
        })
    },

    Delete: async (id) => {
        await module.exports.ListOne(id)

        return prisma.user.delete({
            where: {
                id
            }
        })
    },

    ValidateFields: async (params, id) => {
        const { name, dataNascimento, email, whats, password } = params;

        if(id !== null){
            await module.exports.ListOne(id)
        } else {
            if(password === '') throw new Error('Um ou mais campos vazios!')
            if(password.length < 6) throw new Error('Senha fraca!')
        }

        if(name === '' || dataNascimento === '' || email === '' || whats === '')
        throw new Error('Um ou mais campos vazios!');
    }
}