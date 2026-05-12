const User = require('../models/User')
const jwt = require('jsonwebtoken')
const {unauthenticatedError} = require('../errors/unauthenticated')

const auth = async (req, res, next)=>{
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startswith('Bearer')){
        throw new unauthenticatedError('Authentication Invalid')
    }

    const token = authHeader.split(' ')[1]

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        // attach user to the job routes
        req.user = {userId: payload.userId, name: payload.name}
        next()
    } catch (error) {
        throw new unauthenticatedError('Authentication Invalid')
    }
}

module.exports = auth