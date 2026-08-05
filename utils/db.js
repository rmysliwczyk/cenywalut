import {MongoClient} from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb'

export const client = new MongoClient(MONGODB_URI)
export let isConnected = false
export let initializationFinished = false

export async function dbConnect() {
	try {
		console.log(`[MONGODB] Connecting to ${MONGODB_URI}`)
		await client.connect()
		console.log('[MONGODB] Connected.')
		isConnected = true
	} catch (err) {
		console.log(`[MONGODB] Couldn't connect to ${MONGODB_URI}. Error: ${err.message}`)
	} finally {
		initializationFinished = true
	}
}
