const express = require('express')
const connectDB = require('./config/db')
const request = require('request')
const config = require('config')
const AllStocks = require('./models/Stocks')

const app = express()

connectDB()
// Init Middleware. This will allow us to get the data in the request.body in routes/api
app.use(express.json({ extended: false }))

// can test in postman by going to http://localhost:5000/
app.get('/get_stock_data/:query', (req, res) => {
  const splitTickers = req.params.query.split(/[ ,]+/)
  const joinedTickers = splitTickers.join(',')
  console.log(joinedTickers, 'the joined tickers')
  try {
    const options = {
      // advanced-stats
      uri: `https://cloud.iexapis.com/stable/stock/market/batch?token=${ config.get('cloudKey')}&symbols=${ joinedTickers }&types=quote,news,stats,chart&range=1m&last=5`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    }

    request(options, (error, response, body) => {
      if (error) console.error(error)

      if (response.statusCode !== 200) {
        res.status(404).json({ msg: 'No data found'})
      }

      res.json(JSON.parse(body))
    })
  }
  catch(err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})


app.get('/get_all_tickers', async (req, res) => {
  try {
    const options = {
      uri: `https://cloud.iexapis.com/stable/ref-data/symbols?token=${ config.get('cloudKey')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    }

    request(options, (error, response, body) => {
      if (error) {
        console.error(error)
      }

      if (response.statusCode !== 200) {
        res.status(404).json({ msg: 'No data found'})
      }

      const stocks = JSON.parse(body)

      AllStocks.insertMany(stocks, (error, docs) => {
        if (error) {
          return console.error(error)
        }
        else {
          console.log('all documents saved to db')
        }
      })

      res.json(JSON.parse(body))
    })
  }
  catch(err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

app.get('/find_stock/:query', async (req, res) => {
  const searchParam = req.params.query
  try {
    const searchResults = await AllStocks.find({ $or: [ {"symbol": {'$regex': new RegExp('^' + searchParam, 'i')}}, {"name": {'$regex': new RegExp('^' + searchParam, 'i')}} ] })
    res.json(searchResults)
  }
  catch(err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})


const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`server started on port ${PORT}`))
