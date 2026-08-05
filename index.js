import express from 'express'
import bodyParser from 'body-parser'
import currencies from './routes/currencies.js'
import {isConnected, initializationFinished} from './utils/db.js'
import {fetchCurrenciesFromNBP} from './utils/updateCurrencies.js'

const port = process.env.PORT || 3000

const app = express()

function dbConnectionCheck(req, res, next) {
	if (isConnected == false && initializationFinished == false) {
		const error = new Error(`Databse initialization in progress.`)
		error.statusCode = 202
		next(error)
	} else if (isConnected == false && initializationFinished == true) {
		const error = new Error(`Couldn't connect to database.`)
		error.statusCode = 503
		next(error)
	} else {
		next()
	}
}

function jsonErrorHandler(err, req, res, next) {
	let statusCode = err.statusCode ? err.statusCode : 500
	res.status(statusCode)
	res.setHeader('Content-Type', 'application/json')
	res.send(JSON.stringify({'detail': err.message }))
}

app.use(bodyParser.json())
app.use(dbConnectionCheck)
app.use('/currencies', currencies)
app.use(jsonErrorHandler)

// Refreshing data every 5 minutes:
setInterval(fetchCurrenciesFromNBP, (60 * 1000) * 5)

app.listen(port, () => {
	console.log(`Listening at http://127.0.0.1:${port}`)
})

