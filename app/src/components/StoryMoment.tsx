import { useState } from 'react'
import { FightCommand, StoryProgression } from '../hooks/story'

function OngoingStory(props: {
    progression: StoryProgression
    onProgress: (command: FightCommand) => void
}): JSX.Element {
    const [roundNum, setRoundNum] = useState(0)
    const [action, setAction] = useState<'Attack' | 'Defend'>('Attack')
    const [strategy, setStrategy] = useState<string | null>(null)
    const [effort, setEffort] = useState(0.5)

    return (
        <>
            <div className="uk-flex  uk-flex-center">
                <div className="uk-card uk-card-default uk-card-body uk-width-1-2@m uk-margin-top">
                    <h1 className="uk-heading-small">
                        {roundNum === 0
                            ? 'Preparing to Fight'
                            : `Round ${roundNum}`}
                    </h1>
                    <div className="uk-button-group">
                        <button
                            className={`uk-button uk-button-default ${
                                action === 'Attack' ? 'uk-button-primary' : ''
                            }`}
                            onClick={() => setAction('Attack')}
                        >
                            Attack
                        </button>
                        <button
                            className={`uk-button uk-button-default ${
                                action === 'Defend' ? 'uk-button-primary' : ''
                            }`}
                            onClick={() => setAction('Defend')}
                        >
                            Defend
                        </button>
                    </div>
                    <div className="uk-margin">
                        <label className="uk-form-label">EFFORT</label>
                        <input
                            className="uk-range"
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            defaultValue={0.5}
                            aria-label="Range"
                            onChange={(e) =>
                                setEffort(parseFloat(e.target.value))
                            }
                        />
                    </div>
                    <div className="uk-margin">
                        <textarea
                            className="uk-textarea uk-margin-top"
                            rows={5}
                            placeholder="Strategy"
                            aria-label="Strategy"
                            onChange={(e) => setStrategy(e.target.value)}
                        ></textarea>
                    </div>
                    <button
                        className="uk-button uk-button-default"
                        onClick={() => {
                            setRoundNum(roundNum + 1)
                            props.onProgress({
                                storyId: props.progression.storyId,
                                action,
                                strategy,
                                effort
                            })
                        }}
                    >
                        Continue
                    </button>
                    <textarea
                        className="uk-textarea uk-margin-top"
                        disabled
                        rows={20}
                        value={props.progression.content}
                    ></textarea>
                </div>
            </div>
        </>
    )
}

function StoryEnd(props: {
    progression: StoryProgression
    onReset: () => void
}): JSX.Element {
    return (
        <>
            <div className="uk-flex  uk-flex-center">
                <div className="uk-card uk-card-default uk-card-body uk-width-1-2@m uk-margin-top">
                    <h1 className="uk-heading-small">Fight Over</h1>
                    <button
                        className="uk-button uk-button-default"
                        onClick={props.onReset}
                    >
                        Reset
                    </button>
                    <textarea
                        className="uk-textarea uk-margin-top"
                        disabled
                        rows={20}
                        value={props.progression.content}
                    ></textarea>
                </div>
            </div>
        </>
    )
}

export function StoryMoment(props: {
    progression: StoryProgression
    onProgress: (command: FightCommand) => void
    onReset: () => void
}): JSX.Element {
    if (!props.progression.isFinished) {
        return <OngoingStory {...props} />
    }
    return <StoryEnd {...props} />
}
