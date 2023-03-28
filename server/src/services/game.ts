import { v4 as uuidv4 } from 'uuid'
import { getBoxerName } from './data/boxers'
import { getInjury } from './data/injuries'
import { formatStrategy } from './formatter'
import {
    startFightStory,
    StoryProgression,
    tellFightEventStory,
} from './storyteller'
import { isStrategyValid } from './validator'

const games: Map<string, GameStats> = new Map()

export type Injury = {
    name: string
    severity: number
}

export type FightCommand = {
    storyId: string
    action: 'Attack' | 'Defend'
    effort: number // 0-1
    strategy: string
}

type FightDetails = {
    stats: GameStats
    story: StoryProgression
}

type InputError = {
    error: 'input'
    message: string
}

export type GameStats = {
    player: {
        health: number
        stamina: number
        injuries: Injury[]
    }
    opponent: {
        name: string
        health: number
        stamina: number
        injuries: Injury[]
    }
}

export const startFight = async (): Promise<FightDetails> => {
    const storyId = uuidv4()
    const gameStats = getGame(storyId)
    updateGame(storyId, gameStats)
    return {
        story: await startFightStory(storyId, gameStats.opponent.name),
        stats: gameStats,
    }
}

export const continueFight = async (
    command: FightCommand
): Promise<FightDetails | InputError> => {
    if (command.strategy === undefined) {
        return {
            error: 'input',
            message: 'Strategy is required',
        }
    }

    const strategyResponse = await isStrategyValid(
        await formatStrategy(command.strategy)
    )
    if (strategyResponse.answer === 'no') {
        return {
            error: 'input',
            message: 'Invalid Strategy: ' + strategyResponse.reason,
        }
    }

    const game = getGame(command.storyId)
    const { action: opponentAction, effort: opponentEffort } =
        generateOpponentMove()

    let opponentDefense = 0
    let playerDamage = 0
    let newOpponentInjury = null
    if (command.action === 'Attack') {
        playerDamage = Math.floor(Math.random() * (100 * command.effort))
        if (opponentAction === 'Defend') {
            opponentDefense = Math.floor(Math.random() * (100 * opponentEffort))
            playerDamage -= opponentDefense
        }
        playerDamage = Math.max(0, playerDamage - (100 - game.player.stamina))
        playerDamage += calculateInjuryCost(game.opponent.injuries)
        newOpponentInjury = calculateInjury(playerDamage, game.opponent.stamina)
    }

    let playerDefense = 0
    let opponentDamage = 0
    let newPlayerInjury = null
    if (opponentAction === 'Attack') {
        opponentDamage = Math.floor(Math.random() * (100 * opponentEffort))
        if (command.action === 'Defend') {
            playerDefense = Math.floor(Math.random() * (100 * command.effort))
            opponentDamage -= playerDefense
        }
        opponentDamage = Math.max(
            0,
            playerDamage - (100 - game.opponent.stamina)
        )
        opponentDamage += calculateInjuryCost(game.player.injuries)
        newPlayerInjury = calculateInjury(opponentDamage, game.player.stamina)
    }

    console.log('playerDamage: ' + playerDamage)
    console.log('playerDefense: ' + playerDefense)
    console.log('opponentDamage: ' + opponentDamage)
    console.log('opponentDefense: ' + opponentDefense)

    game.player.health -= opponentDamage
    game.player.stamina -= Math.floor(Math.random() * (50 * command.effort))
    game.player.stamina = Math.max(0, game.player.stamina)

    game.opponent.health -= playerDamage
    game.opponent.stamina -= Math.floor(Math.random() * (50 * opponentEffort))
    game.opponent.stamina = Math.max(0, game.opponent.stamina)

    const storyContent = tellFightEventStory({
        command,
        game,
        opponentAction,
        playerDamage,
        playerDefense,
        opponentDamage,
        opponentDefense,
        newPlayerInjury,
        newOpponentInjury,
    })

    if (newPlayerInjury !== null) {
        game.player.injuries.push(newPlayerInjury)
    }
    if (newOpponentInjury !== null) {
        game.opponent.injuries.push(newOpponentInjury)
    }

    updateGame(command.storyId, game)

    return {
        story: {
            storyId: command.storyId,
            content: await storyContent,
            isFinished:
                game.player.health > 0 && game.opponent.health > 0
                    ? false
                    : true,
        },
        stats: game,
    }
}

const calculateInjuryCost = (injuries: Injury[]): number => {
    return injuries.reduce((acc, injury) => {
        return acc + injury.severity
    }, 0)
}

const calculateInjury = (
    damageReceived: number,
    stamina: number
): Injury | null => {
    if (damageReceived - stamina / 2 > 0) {
        return getInjury()
    }
    return null
}

const generateOpponentMove = (): {
    action: 'Attack' | 'Defend'
    effort: number
} => {
    if (Math.round(Math.random() * 1) === 0) {
        return { action: 'Attack', effort: Math.random() * 1 }
    }
    return { action: 'Defend', effort: Math.random() * 1 }
}

const getGame = (storyId: string): GameStats => {
    let game = games.get(storyId)
    if (!game) {
        game = {
            player: {
                health: 100,
                stamina: 100,
                injuries: [],
            },
            opponent: {
                name: getBoxerName(),
                health: 100,
                stamina: 100,
                injuries: [],
            },
        }
    }
    return game
}

const updateGame = (storyId: string, game: GameStats) => {
    games.set(storyId, game)
}
