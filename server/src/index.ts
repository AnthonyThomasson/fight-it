import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import express, { Express } from 'express'
import path from 'path'
import { continueHandler, startHandler } from './controller/fight'

dotenv.config()
if (process.env.NODE_ENV === 'development') {
    dotenv.config({ path: path.join(__dirname, '..', '.env.development') })
}

const app: Express = express()
app.use(bodyParser.json())
const port = process.env.PORT ?? 3000

app.post('/api/fight/start', startHandler)
app.post('/api/fight/continue', continueHandler)

app.use(express.static(path.join(__dirname, 'public')))
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
