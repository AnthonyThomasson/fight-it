import axios from 'axios'
import { useState } from 'react'
export interface FightCommand {
    storyId: string
    action: 'Attack' | 'Defend'
    effort: number // 0-1
    strategy: string | null
}

type Start = () => Promise<StoryProgression>
type Progress = (
    details: FightCommand
) => Promise<StoryProgression | InputError>
type Reset = () => void
export interface InputError {
    error: 'input'
    message: string
}

export interface StoryProgression {
    storyId: string
    content: string
    isFinished: boolean
}

export default function useFightStory(): [Start, Progress, Reset] {
    const [, setStoryId] = useState(0)

    const start = async (): Promise<StoryProgression> => {
        const response = await axios.post('/api/fight/start')
        console.log(response.data.stats)
        setStoryId(response.data.story.storyId)
        return response.data.story
    }
    const progress = async (
        fightCommand: FightCommand
    ): Promise<StoryProgression | InputError> => {
        console.log(fightCommand)
        const response = await axios.post('/api/fight/continue', fightCommand)
        if (response.data.error !== undefined) {
            return response.data
        }
        console.log(response.data.stats)
        return response.data.story
    }
    const reset = (): void => setStoryId(0)

    return [start, progress, reset]
}
