import axios from 'axios'

export interface DescriptiveResult {
    player: {
        defending: boolean
        attackStrength: 'Weak' | 'Strong'
        wellbeing: 'Healthy' | 'Injured' | 'Dead'
    }
    opponent: {
        defending: boolean
        attackStrength: 'Weak' | 'Strong'
        wellbeing: 'Healthy' | 'Injured' | 'Dead'
    }
}

export const getAttackStrengthDescription = (
    damage: number
): 'Weak' | 'Strong' => {
    if (damage < 10) {
        return 'Weak'
    }
    return 'Strong'
}
export const getWellbeingDescription = (
    health: number
): 'Healthy' | 'Injured' | 'Dead' => {
    if (health <= 0) {
        return 'Dead'
    }
    if (health < 50) {
        return 'Injured'
    }
    return 'Healthy'
}

export const getDescriptionOfAction = async (
    resultDescription: DescriptiveResult
): Promise<string> => {
    console.log(resultDescription)
    const response = await axios.post(`api/describe`, {
        ...resultDescription,
        language: navigator.language
    })
    console.log('Response', response.data)
    return response.data
}
