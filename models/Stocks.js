const mongoose = require('mongoose')


const AllStocksSchema = new mongoose.Schema({
  symbol: String,
  name: String
})


module.exports = AllStocks = mongoose.model( 'allStocks', AllStocksSchema )
