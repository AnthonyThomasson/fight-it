import React, { useState } from 'react'
import { StoryLoading } from './components/StoryLoading'
import { StoryMoment } from './components/StoryMoment'
import { StoryStart } from './components/StoryStart'
import useFightStory, {
    FightCommand,
    InputError,
    StoryProgression
} from './hooks/story'

function App(): JSX.Element {
    const [start, progress, reset] = useFightStory()
    const [currentProgression, setCurrentProgression] =
        React.useState<StoryProgression | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const onStoryStart = (): void => {
        setLoading(true)
        start()
            .then((progression) => setCurrentProgression(progression))
            .catch((error) => console.log(error))
            .finally(() => setLoading(false))
    }
    const onProgressStory = (fightCommand: FightCommand): void => {
        setLoading(true)
        progress(fightCommand)
            .then((response) => {
                if (Object.prototype.hasOwnProperty.call(response, 'error')) {
                    const error = response as InputError
                    setError(error.message)
                    return
                }
                setError(null)
                const story = response as StoryProgression
                setCurrentProgression(story)
            })
            .catch((error) => console.log(error))
            .finally(() => setLoading(false))
    }
    const onReset = (): void => {
        reset()
        setCurrentProgression(null)
    }
    const errorMessage =
        error !== null ? (
            <div className="uk-alert-danger uk-alert">
                <a className="uk-alert-close uk-close"></a>
                <p>{error}</p>
            </div>
        ) : (
            ''
        )
    if (loading) {
        if (currentProgression === null) {
            return (
                <div className="App">
                    {errorMessage}
                    <StoryLoading storyStart={true} />
                </div>
            )
        }
        return (
            <div className="App">
                {errorMessage}
                <StoryLoading storyStart={true} />
            </div>
        )
    }

    if (currentProgression === null) {
        return (
            <div className="App">
                {errorMessage}
                <StoryStart onStoryStart={onStoryStart} />
            </div>
        )
    }

    return (
        <div className="App">
            {errorMessage}
            <StoryMoment
                onProgress={(fightCommand: FightCommand) =>
                    onProgressStory(fightCommand)
                }
                progression={currentProgression}
                onReset={onReset}
            />
        </div>
    )
}

export default App
