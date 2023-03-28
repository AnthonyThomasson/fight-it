import { AxiosResponse } from 'axios'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express, { Express, Request, Response } from 'express'
import {
    ChatCompletionRequestMessage,
    Configuration,
    CreateChatCompletionResponse,
    OpenAIApi,
} from 'openai'
import path from 'path'

dotenv.config()
// eslint-disable-next-line @typescript-eslint/typedef
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

type Status = {
    defending: boolean
    attackStrength: 'Weak' | 'Strong'
    wellbeing: 'Healthy' | 'Injured' | 'Dead'
}

const generateActionString: (name: string, status: Status) => string = (
    name: string,
    status: Status
): string => {
    if (status.defending) {
        return `${name} defends and does not attack`
    }
    return `${name} performs a ${status.attackStrength.toLowerCase()} attack with ${
        status.attackStrength.toLowerCase() === 'weak' ? 'little' : 'massive'
    } damage.`
}
const generateHealthString: (name: string, status: Status) => string = (
    name: string,
    status: Status
): string => {
    if (status.wellbeing === 'Dead') {
        return `${name} is ${status.wellbeing.toLowerCase()}`
    }
    return `${name} is ${status.wellbeing.toLowerCase()} and remains standing`
}

const app: Express = express()
app.use(cors())
app.use(bodyParser.json())
// eslint-disable-next-line @typescript-eslint/typedef
const port = process.env.PORT ?? 3000

app.post('/api/describe', async (req: Request, res: Response) => {
    const openai: OpenAIApi = new OpenAIApi(configuration)

    const aiPrompt = `Expand the following points to be more dramatic:
    ${generateActionString('player', req.body.player)}
    ${generateActionString('opponent', req.body.opponent)}
    ${generateHealthString('player', req.body.player)}
    ${generateHealthString('opponent', req.body.opponent)}
    ${
        req.body.player.wellbeing === 'Dead' ||
        req.body.opponent.wellbeing === 'Dead'
            ? ''
            : 'player watches their opponent considering what move to make next'
    }`
    console.log(aiPrompt)

    try {
        const messages: ChatCompletionRequestMessage[] = [
            {
                role: 'system',
                content:
                    'You are simulating a boxing match between two people. One person is referred to as "player" and the other "opponent"',
            },
            {
                role: 'user',
                content: aiPrompt,
            },
        ]

        const completion: AxiosResponse<CreateChatCompletionResponse, unknown> =
            await openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages,
            })

        res.send(completion.data.choices[0].message?.content ?? 'No response')
    } catch (error) {
        console.log(error)
        res.status(500).send(
            'Something went wrong with the OpenAI API. Please try again later.'
        )
    }
})

app.use(express.static(path.join(__dirname, 'public')))
app.get('/files/*/:file', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'files', req.params.file))
})
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
