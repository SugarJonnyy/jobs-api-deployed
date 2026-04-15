const register = (req, res) =>{
    res.send(`regsitering user`)
}

const login = (req, res)=>{
    res.send(`loggin in the registerd account`)
}

module.exports = {
    register,
    login
}