import express from 'express'
import cors from 'cors'
import { MongoClient } from 'mongodb'
import chalk from 'chalk'

import defineUserRoutes from './routes/userRoutes.js'
import definePostRoutes from './routes/postRoutes.js'
import defineSpotifyRoutes from './routes/spotifyRoutes.js'

const PORT = 3000
const dbHost = 'localhost:27017'
const dbName = 'saeApp'

const app = express()
app.use(express.json())
app.use(cors())

const mongoClient = new MongoClient(`mongodb://root:root@${dbHost}`)

app.get('/', (req, res) => {
    res.send('Fabios SAE-Express-Server')
})

app.listen(PORT, () => {
    mongoClient
        .connect()
        .then(() => {
            console.log(
                chalk.cyan('[MONGO] Connected to Database-Server on:'),
                chalk.green(dbHost),
                '\n'
            )
            const db = mongoClient.db(dbName)

            defineUserRoutes(app, db)
            definePostRoutes(app, db)
            defineSpotifyRoutes(app, db)
        })
        .catch(console.error)

    console.log(
        chalk.cyan(`\n[EXPRESS] Server gestartet auf Port:`),
        chalk.green(PORT)
    )
})