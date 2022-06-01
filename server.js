import express from 'express'
import { MongoClient } from 'mongodb'
import chalk from 'chalk'

import defineRoutes from './routes.js'

const PORT = 3000
const dbHost = 'cluster0.ydwtqud.mongodb.net'
const dbName = 'saeApp'

const app = express()
app.use(express.json())

const mongoClient = new MongoClient(`mongodb+srv://sae:sae@${dbHost}`)

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

            defineRoutes(app, db)
        })
        .catch(console.error)

    console.log(
        chalk.cyan(`\n[EXPRESS] Server gestartet auf Port:`),
        chalk.green(PORT)
    )
})
