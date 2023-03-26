import { useRef, useState } from 'react'
import {
    getAttackStrengthDescription,
    getDescriptionOfAction,
    getWellbeingDescription
} from './hooks/ai'

type Move = 'Attack' | 'Defend' | null

interface CharacterState {
    health: number
    stamina: number
}

const generateOpponentMove = (): Move => {
    if (Math.round(Math.random() * 1) === 0) {
        return 'Attack'
    }
    return 'Defend'
}

const processesMove = async (
    playerMove: Move,
    opponentMove: Move,
    playerState: CharacterState,
    opponentState: CharacterState
): Promise<[CharacterState, CharacterState, string]> => {
    const newPlayerState = playerState
    const newOpponentState = opponentState

    let playerDamage = 0
    if (playerMove === 'Attack') {
        playerDamage = Math.floor(Math.random() * 100)
        if (opponentMove === 'Defend') {
            playerDamage = Math.abs(playerDamage / 2)
        }
        newOpponentState.health -= playerDamage
    }

    let opponentDamage = 0
    if (opponentMove === 'Attack') {
        opponentDamage = Math.floor(Math.random() * 100)
        if (playerMove === 'Defend') {
            opponentDamage = Math.abs(opponentDamage / 2)
        }
        newPlayerState.health -= opponentDamage
    }

    return [
        newPlayerState,
        newOpponentState,
        await getDescriptionOfAction({
            player: {
                defending: playerMove === 'Defend',
                attackStrength: getAttackStrengthDescription(opponentDamage),
                wellbeing: getWellbeingDescription(newPlayerState.health)
            },
            opponent: {
                defending: opponentMove === 'Defend',
                attackStrength: getAttackStrengthDescription(playerDamage),
                wellbeing: getWellbeingDescription(newOpponentState.health)
            }
        })
    ]
}

function Result(props: {
    loading: boolean
    playerMove: Move
    opponentMove: Move
    playerState: CharacterState
    opponentState: CharacterState
    description: string
}): JSX.Element {
    if (props.loading) {
        return (
            <div id="result">
                <p>Loading</p>
            </div>
        )
    }
    if (props.playerState.health <= 0) {
        return (
            <div id="result">
                <p>You Lose</p>
                <textarea
                    disabled
                    style={{
                        overflowY: 'scroll',
                        height: '500px',
                        width: '80vw',
                        resize: 'none'
                    }}
                >
                    {props.description}
                </textarea>
            </div>
        )
    }

    if (props.opponentState.health <= 0) {
        return (
            <div id="result">
                <p>You Win</p>
                <textarea
                    disabled
                    style={{
                        overflowY: 'scroll',
                        height: '500px',
                        width: '80vw',
                        resize: 'none'
                    }}
                >
                    {props.description}
                </textarea>
            </div>
        )
    }

    return (
        <div id="result">
            {/* <ul id="stats">
                <li>Player Move: {props.playerMove ?? 'Not Started'}</li>
                <li>Opponent Move: {props.opponentMove ?? 'Not Started'}</li>
                <li>Player Health: {props.playerState.health}</li>
                <li>Opponent Health: {props.opponentState.health}</li>
            </ul> */}
            <div style={{ margin: '50px' }} id="description">
                <textarea
                    disabled
                    style={{
                        overflowY: 'scroll',
                        height: '500px',
                        width: '80vw',
                        resize: 'none'
                    }}
                >
                    {props.description}
                </textarea>
            </div>
        </div>
    )
}

function App(): JSX.Element {
    const [loading, setLoading] = useState(false)
    const [description, setDescription] = useState('Waiting to fight')
    const [playerState, setPlayerState] = useState<CharacterState>({
        health: 100,
        stamina: 100
    })
    const [opponentState, setOpponentSate] = useState<CharacterState>({
        health: 100,
        stamina: 100
    })
    const [playerMove, setPlayerMove] = useState<Move>(null)
    const [opponentMove, setOpponentMove] = useState<Move>(null)
    const moveSelection = useRef<HTMLSelectElement>(null)

    return (
        <div className="App">
            <div id="controls">
                <select name="move" id="move" ref={moveSelection}>
                    <option value="Attack">ATTACK</option>
                    <option value="Defend">DEFEND</option>
                </select>
                <button
                    disabled={loading}
                    onClick={() => {
                        const newOpponentMove = generateOpponentMove()
                        const newPlayerMove = moveSelection.current
                            ?.value as Move
                        setLoading(true)
                        processesMove(
                            newPlayerMove,
                            newOpponentMove,
                            playerState,
                            opponentState
                        )
                            .then(
                                ([
                                    newPlayerState,
                                    newOpponentState,
                                    newDescription
                                ]) => {
                                    setDescription(newDescription)
                                    setPlayerMove(newPlayerMove)
                                    setOpponentMove(newOpponentMove)
                                    setOpponentSate({ ...newOpponentState })
                                    setPlayerState({ ...newPlayerState })
                                    setLoading(false)
                                }
                            )
                            .catch((error) => {
                                console.error(error)
                            })
                    }}
                >
                    Process Action
                </button>
            </div>

            <div id="story"></div>

            <Result
                loading={loading}
                playerMove={playerMove}
                opponentMove={opponentMove}
                playerState={playerState}
                opponentState={opponentState}
                description={description}
            />
        </div>
    )
}

export default App
