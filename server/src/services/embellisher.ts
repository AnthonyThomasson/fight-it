import { ask } from './ai'
import {
    getHugeSynonym,
    getLargeSynonym,
    getModerateSynonym,
    getSmallSynonym,
} from './data/synonyms'
import { Injury } from './game'
import { getLanguage } from './language'
export type Events = Event[]
type Event =
    | CustomEvent
    | AttackEvent
    | DefenseEvent
    | InjuryEvent
    | FinishEvent
type CustomEvent = {
    type: 'custom'
    text: string
}
type AttackEvent = {
    type: 'attack'
    attacker: string
    victim: string
    damage: number
    strategy: string | null
    injury: Injury | null
}
type DefenseEvent = {
    type: 'defense'
    defender: string
    damage: number
    strategy: string | null
    injury: Injury | null
}
type InjuryEvent = {
    type: 'injury'
    name: string
    victim: string
}

type FinishEvent = {
    type: 'finish'
    victim: string
    reason: string
}

export const embellish = async (
    storyId: string,
    conditions: string,
    events: Events,
    words: number
): Promise<string> => {
    const command = `Expand the following points to be a dramatic story. Keep your response under ${words} words.
    
    ${
        getLanguage() === 'es' || getLanguage() === 'es-ar'
            ? 'Write the story in Spanish'
            : ''
    }\n\n`

    let points = ''
    for (const event of events) {
        switch (event.type) {
            case 'custom':
                points += `${event.text}\n`
                break
            case 'attack':
                if (event.attacker === 'player') {
                    points += `I use the strategy of ${
                        event.strategy
                    } to attack my opponent ${
                        event.victim
                    } doing ${getDamageDescriptor(event.damage)} damage${
                        event.injury === null
                            ? '.'
                            : `, despite my injury of ${event.injury.name}`
                    }\n`
                } else {
                    points += `${
                        event.attacker
                    } performs a attack doing ${getDamageDescriptor(
                        event.damage
                    )} damage${
                        event.injury === null
                            ? ''
                            : `, despite their injury of ${event.injury.name}`
                    }\n`
                }
                break
            case 'defense':
                if (event.defender === 'player') {
                    points += `I defend ${getDamageDescriptor(
                        event.damage
                    )} damage and do not attack${
                        event.injury === null
                            ? ','
                            : ` despite my injury of ${event.injury.name},`
                    } using the strategy of ${event.strategy}\n`
                } else {
                    points += `${event.defender} defends ${getDamageDescriptor(
                        event.damage
                    )} damage and does not attack${
                        event.injury === null
                            ? ','
                            : ` despite their injury of ${event.injury.name}`
                    }\n`
                }
                break
            case 'injury':
                if (event.victim === 'player') {
                    points += `I gain an injury of ${event.name}\n`
                } else {
                    points += `${event.victim} gains an injury of ${event.name}\n`
                }
                break
            case 'finish':
                if (event.victim === 'player') {
                    points += `I lose the match because ${event.reason}\n`
                } else {
                    points += `${event.victim} loses the match because ${event.reason}\n`
                }
                break
            default:
                break
        }
    }

    const embellishedContent = await ask(storyId, `${command}\n${points}`)
    return embellishedContent
}

const getDamageDescriptor = (damage: number): string => {
    if (damage < 10) {
        return `a ${getSmallSynonym()} amount of`
    } else if (damage < 20) {
        return `a ${getModerateSynonym()} amount of`
    } else if (damage < 30) {
        return `a ${getLargeSynonym()} amount of`
    } else {
        return `a ${getHugeSynonym()} amount of`
    }
}
