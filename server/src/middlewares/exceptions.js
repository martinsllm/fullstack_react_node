module.exports = (err, req, res, next) => {
    
    if(err.message === 'Resultado não encontrado!')
        return res.status(404).json({message: err.message})

    if(err.message === 'Dado já registrado!')
        return res.status(409).json({message: err.message})

    if(err.message === 'Um ou mais campos vazios!' || err.message === 'Senha fraca!')
        return res.status(400).json({message: err.message})
    
    if(err.message === 'Senha incorreta!' || err.message === 'Não autorizado!')
        return res.status(401).json({message: err.message})

    else return res.status(500).json({message: err.message})
}   