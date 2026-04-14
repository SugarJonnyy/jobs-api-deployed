require('dotenv').config()
const express = require('express')
const app = express()

// middlewares
const asyncWrapper = require('./middlewares/async')
const errorHandlerMiddleware = require('./middlewares/errorhandler')
const notFoundMiddleware = require('./middlewares/notFound')


app.use(express.json())

app.get('/', (req, res)=>{
    res.send("Jobs")
})

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT

const start = async ()=>{
    try {
        app.listen(port, (req, res)=>{
            console.log(`Server is listening to the ${port}`);
        })
    } catch (error) {
        console.log(error);
    }
}

start()

