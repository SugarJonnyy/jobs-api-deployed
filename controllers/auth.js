const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const bcrypt = require('bcryptjs')

const register = async (req, res) =>{


    const user = await User.create({...tempUser})
    res.status(StatusCodes.CREATED).json({user})
}

const login = (req, res)=>{
    res.send(`loggin in the registerd account`)
}

module.exports = {
    register,
    login
}