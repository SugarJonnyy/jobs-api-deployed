const Job = require('../models/job')
const badRequestError = require('../errors/bad-request')
const unauthenticatedError = require('../errors/unauthenticated')
const { StatusCodes } = require('http-status-codes')

const getAllJobs = async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt')
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}

const getJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId } } = req
    const job = await Job.findOne({ _id: jobId, createdBy: userId })
    if (!job) {
        throw new badRequestError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({ job })
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({ job })
}

const updateJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId }, body } = req
    const job = await Job.findOneAndUpdate(
        { _id: jobId, createdBy: userId },
        body,
        { new: true, runValidators: true }
    )
    if (!job) {
        throw new badRequestError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({ job })
}

const deleteJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId } } = req
    const job = await Job.findOneAndDelete({ _id: jobId, createdBy: userId })
    if (!job) {
        throw new badRequestError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({ msg: 'Job deleted successfully' })
}

module.exports = {
    getAllJobs,
    getJob,
    deleteJob,
    updateJob,
    createJob
}