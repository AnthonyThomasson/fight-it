import { askYesNoQuestion, QuestionResponse } from './question'

export const isStrategyValid = async (
    strategy: string
): Promise<QuestionResponse> => {
    const response = await askYesNoQuestion(`
    The following strategy can NOT involve any of the following:
    - using objects as weapons (a persons limbs are not included in this category)
    - leaving or fleeing
    - using any form of magic
    - using any form of technology
    - using any form of supernatural powers
    - using any form of time travel
    - using any form of teleportation
    - using any form of mind control

    The following strategy CAN involve any of the following:
    - slapping
    - saying hurtful things to them
    - unarmed combat
    - can be impractical, or unadvisable. The strategy does not need to be practical or advisable.
    - can escalate the situation

    The following strategy does NOT need to be any of the following:
    - does NOT need to be legal
    - does NOT need to be moral
    - does NOT need to be advisable
    - does NOT need to de escalate the situation
    - does NOT need to be practical
    - does NOT need to prevent physical harm

    The following strategy SHOULD be physically possible, but does not need to involve physical action.

    Is the following strategy valid?
    When considering this question, know that you are not advising what a person should do, but rather what a person COULD do.

	STRATEGY: ${strategy}
	`)
    return response
}
