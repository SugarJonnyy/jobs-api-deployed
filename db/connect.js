const { default: mongoose } = require("mongoose");

const connectDB = (url)=>{
    console.log("Connect to DB...");
    return mongoose.connect(url)
}

module.exports = connectDB