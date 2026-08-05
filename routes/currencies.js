import express from 'express'
import {client} from '../utils/db.js'

const router = express.Router()


// Read
router.get('/:currencyCode', async (req, res, next) => {
	const db = client.db("cenywalut")

	const currency = await db.collection('waluty').findOne({_id: req.params.currencyCode})

	if (!currency) {
		const error = new Error(`No currency with code ${req.params.currencyCode}`)
		error.statusCode = 404
		next(error)
	} else {
		res.send(currency)
	}
})

// Read all
router.get('/', async (req, res, next) => {
	const db = client.db("cenywalut")

	const currencies = await db.collection('waluty').find({}).toArray()

	if (!currencies) {
		const error = new Error(`Couldn't get currencies data`)
		error.statusCode = 404
		next(error)
	} else {
		res.send(currencies)
	}
})

export default router
