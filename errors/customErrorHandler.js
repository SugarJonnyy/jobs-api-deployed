

class customAPIError extends Error{
    constructor(message){
        super(message)
    
    }
}

const createCustomAPIError = (msg , statusCode) =>{
    return new customAPIError(msg, statusCode)
}

module.exports = {createCustomAPIError, customAPIError}