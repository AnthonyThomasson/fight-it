import { askIsolated } from './ai'
export type QuestionResponse = {
    reason: string
    answer: 'yes' | 'no'
}
export const modifyCommand = async (
    modificationCommand: string,
    data: string
): Promise<string> => {
    const response = await askIsolated(
        `You must modify some data based on some conditions, and respond with nothing but the modified data. Do not identify which the modified data is just return the new content and nothing else`,
        `Modify the following data based on the following conditions:
        
        Conditions: ${modificationCommand}
        Data: ${data}
        `
    )
    return response
}
