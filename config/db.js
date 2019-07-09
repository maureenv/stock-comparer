const mongoose = require('mongoose')
const config = require('config')
const db = config.get('mongoURI')


const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
    }) // mongoose.connect returns a promise so we need an await

    console.log('Mongo DB connected...')
  }
  catch(err) {
    console.error(err.message)
    // exit process with failure
    process.exit(1)
  }
}

module.exports = connectDB
