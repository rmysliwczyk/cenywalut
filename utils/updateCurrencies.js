import {client} from '../utils/db.js'

const NBPBaseURL = process.env.NBP_BASE_URL || "https://api.nbp.pl/api/exchangerates/"

// Create
async function addCurrency(currencyCode, data) {
	console.log(`Attempting to add currency: ${currencyCode}`)
	const db = client.db("cenywalut")

	const currency = data
	data._id = currencyCode

	const response = await db.collection('waluty').insertOne(currency)
	if (response.acknowledged != true) {
		const error = new Error(`Couldn't add currency with code ${currencyCode}`)
		throw error
	} else {
		console.log(`Added currency: ${currencyCode}`)
	}
}

// Update
async function updateCurrency(currencyCode, data) {
	console.log(`Attempting to update currency: ${currencyCode}`)
	const db = client.db("cenywalut")

	const currency = await db.collection('waluty').findOne({_id: currencyCode})

	if (!currency) {
		const error = new Error(`No currency with code ${currencyCode}`)
		throw error
	} else {
		const updatedCurrency = data
		updatedCurrency._id = currency._id

		const response = await db.collection('waluty').replaceOne({_id: currencyCode}, updatedCurrency)
		if (response.acknowledged != true) {
			const error = new Error(`Couldn't update currency with code ${currencyCode}`)
			throw error
		} else {
			console.log(`Updated currency: ${currencyCode}`)
		}
	}
}

// Fetch and Update or Create
export async function fetchCurrenciesFromNBP() {
	console.log("Fetching currencies from NBP...")
	const res = await fetch(`${NBPBaseURL}/tables/C`, {headers: {"Content-Type": "application-json"}})

	if (res.status !== 200) {
		throw new Error("Couldn't fetch currencies data from NBP")
	} else {
		const currencies = (await res.json())[0].rates
		for (let currency of currencies) {
			const parsedData  = {"bid": currency.bid, "ask": currency.ask, "name": currency.currency, "fetchDate": (new Date())}
			try {
				// Trying to update.
				await updateCurrency(currency.code, parsedData)
			} catch (err) {
				//Adding new if not present.
				if (err.message.includes("No currency with code")) {
					addCurrency(currency.code, parsedData)
				} else {
					throw err
				}
			}
		}
	}
}
