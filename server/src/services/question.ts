import { askIsolated } from './ai'
export type QuestionResponse = {
    reason: string
    answer: 'yes' | 'no' | 'unknown'
}
export const askYesNoQuestion = async (
    question: string
): Promise<QuestionResponse> => {
    const response = await askIsolated(
        `You must answer the question either as "yes" or "no", and specify your reasoning in the following format: 
        Answer: yes|no
        Reason: your reason`,
        question
    )

    const match = response.match(/Answer:\s*(.*)\s*Reason:\s*(.*)/)
    const verdictMatch = match?.[1] ?? 'Unknown reason'
    const reasonMatch = match?.[2] ?? 'unknown'

    let verdict: 'yes' | 'no' = 'yes'
    if (/.*no|No.*/.test(verdictMatch)) {
        verdict = 'no'
    }

    return {
        reason: reasonMatch ?? 'Unknown reason',
        answer: verdict,
    }
}
