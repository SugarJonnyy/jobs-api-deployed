require('dotenv').config()
const express = require('express')
const app = express()

// middlewares
const asyncWrapper = require('./middlewares/async')
const errorHandlerMiddleware = require('./middlewares/errorhandler')
const notFoundMiddleware = require('./middlewares/notFound')
const connectDB = require('./db/connect')
const authenticateUser = require('./middlewares/auth')

const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')

app.use(express.json())

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobsRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT

const start = async ()=>{
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, ()=>{
            console.log(`Server is listening to the ${port}`);
        })
    } catch (error) {
        console.log(error);
    }
}

start()

