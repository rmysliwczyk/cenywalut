import {MongoClient} from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://t530-server'

export const client = new MongoClient(MONGODB_URI)
export let isConnected = false
export let initializationFinished = false

async function dbConnect() {
	try {
		console.log('[MONGODB] Connecting...')
		await client.connect()
		console.log('[MONGODB] Connected.')
		isConnected = true
	} catch (err) {
		console.log(`[MONGODB] Couldn't connect to ${MONGODB_URI}. Error: ${err.message}`)
	} finally {
		initializationFinished = true
	}
}

dbConnect()

