require('dotenv').config()
const express = require('express')
const app = express()


// extra security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss')
const rateLimiter = require('express-rate-limit')

// middlewares
const asyncWrapper = require('./middlewares/async')
const errorHandlerMiddleware = require('./middlewares/errorhandler')
const notFoundMiddleware = require('./middlewares/notFound')
const connectDB = require('./db/connect')
const authenticateUser = require('./middlewares/auth')

const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')

app.use(express.json())
// security packages
app.use(rateLimiter({
        windowMs: 15 * 60 * 1000, // 15 minutes
        limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
        standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
        ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
        // store: ... , // Redis, Memcached, etc. See below.
}))
app.use(helmet)
app.use(cors)
app.use(xss)


app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobsRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

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

