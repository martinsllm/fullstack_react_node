const { generateKey, convertKey } = require('../services/token');
const { checkPassword } = require('../services/bcrypt')
const mailer = require('../services/mailer');
const UserData = require('../data/UserData');

module.exports = {

    async Login(req, res, next) {
        try {
            const { email, password } = req.body;

            const user = await UserData.ListFirst({ email })

            if(await checkPassword(password, user.password)){
                return res.json({
                    token: generateKey(email)
                })
            } else 
                throw new Error('Senha incorreta!')


        } catch (error) {
            next(error)
        }
    },

    async SendEmail(req, res, next) {
        try {
            const { email } = req.body;

            if(email === "") throw new Error('Um ou mais campos vazios!')

            const user = await UserData.ListFirst({ email })
            if(!user) throw new Error('Resultado não encontrado!')

            mailer.sendMail({
                from: process.env.APP_MAILER_USER,
                to: email,
                subject: "Alteração de senha",
                html: "<div> <p>Esqueceu sua senha? Sem problemas, recupere utilizando o token disponibilizado abaixo: </p> </hr>" + generateKey(email) + "</div>"
            });

            return res.status(201).json();
        } catch (error) {
            next(error)
        }
    },

    async ChangePassword(req, res, next) {
        try {
            const { authorization, password } = req.body;

            const email = convertKey(authorization);

            await UserData.ListFirst({email})
            await UserData.UpdatePassword({email, password})

            return res.status(201).json();
        } catch (error) {
            next(error)
        }
    }
}