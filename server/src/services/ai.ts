import { AxiosResponse } from 'axios'
import {
    ChatCompletionRequestMessage,
    Configuration,
    CreateChatCompletionResponse,
    OpenAIApi,
} from 'openai'

export const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

const messageHistory: Map<string, ChatCompletionRequestMessage[]> = new Map()

export const clear = (storyId: string) => messageHistory.delete(storyId)

export const rules = (storyId: string, command: string) => {
    addToMessageHistory(storyId, {
        role: 'system',
        content: command,
    })
}

export const askIsolated = async (systemMessage: string, command: string) => {
    const openai: OpenAIApi = new OpenAIApi(configuration)

    try {
        const completion: AxiosResponse<CreateChatCompletionResponse, unknown> =
            await openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: systemMessage,
                    },
                    {
                        role: 'user',
                        content: command,
                    },
                ],
                top_p: 1,
            })
        if (completion.data.choices[0].message?.content === undefined) {
            throw new Error('Unable to parse response from OpenAI API')
        }
        return completion.data.choices[0].message.content
    } catch (error) {
        throw new Error('OpenAI API error: ' + error)
    }
}

export const ask = async (storyId: string, command: string) => {
    if (process.env.DISABLE_AI === 'true') {
        return Promise.resolve(command)
    }

    const openai: OpenAIApi = new OpenAIApi(configuration)
    const messages: ChatCompletionRequestMessage[] = [
        ...getMessageHistory(storyId),
        {
            role: 'user',
            content: command,
        },
    ]
    try {
        const completion: AxiosResponse<CreateChatCompletionResponse, unknown> =
            await openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages,
                top_p: 1,
            })
        if (completion.data.choices[0].message?.content === undefined) {
            throw new Error('Unable to parse response from OpenAI API')
        }

        if (process.env.NODE_ENV === 'development') {
            const promptLogs = messages.map((message) => {
                return `\n\n**${message.role}**: ${message.content}\n\n`
            })

            return `${completion.data.choices[0].message.content}\n\n**content was generated based on the following command**\n\n${promptLogs}`
        }

        return completion.data.choices[0].message.content
    } catch (error) {
        throw new Error('OpenAI API error: ' + error)
    }
}

const addToMessageHistory = (
    storyId: string,
    message: ChatCompletionRequestMessage
): ChatCompletionRequestMessage[] => {
    let history = messageHistory.get(storyId)
    if (history === undefined) {
        history = []
    }
    history.push(message)
    messageHistory.set(storyId, history)
    return history
}

const getMessageHistory = (storyId: string): ChatCompletionRequestMessage[] => {
    let history = messageHistory.get(storyId)
    if (history === undefined) {
        history = []
    }
    return history
}
