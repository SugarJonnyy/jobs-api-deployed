const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const badRequestError = require('../errors/bad-request')
const unauthenticatedError = require('../errors/unauthenticated')

const register = async (req, res) => {
    const user = await User.create({...req.body})
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({ user: {name: user.name}, token})
}

const login = async (req, res) => {
    const {email, password} = req.body
    if(!email || !password){
        throw new badRequestError('Please provide email and password')
    }
    const user = await User.findOne({ email })

    if(!user){
        throw new unauthenticatedError('Invalid Credentials')
    }

    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
        throw new unauthenticatedError('Invalid Credentials')
    }
    
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({user: {name: user.name}, token})
}

module.exports = {
    register,
    login
}