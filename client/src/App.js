import React, { Fragment, useState, useEffect } from 'react'
import axios from 'axios'


const App = () => {
  const [formData, setFormData] = useState({
    searchParam: '',
    tickers: '',
    stockData: []
  })

  const [ searchResults, setSearchResults ] = useState([])

  const {
    searchParam,
    tickers,
  } = formData

// use spread operator to copy existing form data so it stays the same, then add the field you want to change afterwards.
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmit = async e => {
    e.preventDefault()

    try {
      const res = await axios.get(`/get_stock_data/${ tickers }`)
      console.log(res.data)
    }
    catch (err) {
      console.error(err.response.data)
    }
  }

  const onSearch = async e => {
    setFormData({ ...formData, searchParam: e.target.value })
    try {
      const res = await axios.get(`/find_stock/${ searchParam }`)
      setSearchResults( res.data )
    }
    catch (err) {
      console.error(err.response.data)
    }
  }

  // chart
  // dividend
  // financials
  // in the news

  return (
    <div className="bg-black h-screen p-4">
      <h1 className="text-center text-white text-bold text-6xl"> Stock Comparer </h1>
      <h2 className="text-center text-white text-regular text-3xl mt-3"> Compare stocks and indexes easily!  </h2>
      <div className="flex justify-center flex-col mt-4 items-center">
        <p className="text-white text-regular mb-2"> Search and select up to 5 stocks to compare! </p>
        {/*<div>
          <input
            type="text"
            placeholder="stock ticker"
            name="tickers"
            className=""
            value={ tickers }
            onChange={ e => onChange(e)}
          />
          <button onClick={ e => onSubmit(e) }>Compare</button>
        </div>*/}
        <input
          type="text"
          placeholder="search stock"
          name="searchParam"
          value={ searchParam }
          onChange={ e => onSearch(e)}
        />
      </div>
    </div>
  )
}

export default App;
