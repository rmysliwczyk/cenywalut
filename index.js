import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import currencies from './routes/currencies.js'
import {dbConnect, isConnected, initializationFinished} from './utils/db.js'
import {fetchCurrenciesFromNBP} from './utils/updateCurrencies.js'

const port = process.env.PORT || 3000

const app = express()
app.use(cors())

function dbConnectionCheck(req, res, next) {
	if (isConnected == false && initializationFinished == false) {
		console.log(`Database initialization in progress.`)
		next()
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

app.listen(port, async () => {
	console.log(`Server starting...`)

	console.log(`Database initialization...`)
	await dbConnect()
	console.log(`Database initialized.`)

	console.log(`Fetching API data...`)
	await fetchCurrenciesFromNBP()
	console.log(`API data fetched.`)

	// Refreshing API data every 15 minutes
	setInterval(fetchCurrenciesFromNBP, (60 * 1000) * 15)
	console.log(`Listening at http://127.0.0.1:${port}`)
})

