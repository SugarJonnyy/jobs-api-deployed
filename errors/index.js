const unauthenticatedError = require('./unauthenticated')
const {customAPIError} = require('./customErrorHandler')
const badRequestError = require('./bad-request')


module.exports = {
    unauthenticatedError,
    badRequestError, 
    customAPIError
}