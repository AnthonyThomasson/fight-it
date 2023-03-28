import { modifyCommand } from './modify'

export const formatStrategy = async (strategy: string): Promise<string> => {
    const response = await modifyCommand(
        `Modify the data so it could fit in the following sentence:
        I use the strategy of <data> to attack

        If the data is in a language that is not english translate it to english.

        Only return the data modified and not the sentence it fits in. Don't include any punctuation in the result. Format the response to be structured as follows:

        FORMATTED: new formatted data
        `,
        strategy
    )
    return response.replace('FORMATTED: ', '')
}
