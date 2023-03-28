let language = 'en-us'
export const setLanguage = (newLanguage: string): void => {
    language = newLanguage.split(',')[0].toLowerCase()
}
export const getLanguage = (): string => language
