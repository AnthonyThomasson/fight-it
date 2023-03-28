import { Request, Response } from 'express'
import { startFight } from '../services/game'
import { setLanguage } from './../services/language'

import { continueFight } from './../services/game'

export const startHandler = async (req: Request, res: Response) => {
    try {
        setLanguage(req.headers['accept-language'] ?? 'en-us')
        res.json(await startFight())
    } catch (e) {
        res.status(500).json({
            error:
                e instanceof Error
                    ? e.message
                    : 'An unknown error occurred starting the fight',
        })
    }
}
export const continueHandler = async (req: Request, res: Response) => {
    try {
        setLanguage(req.headers['accept-language'] ?? 'en-us')
        res.send(await continueFight(req.body))
    } catch (e) {
        res.status(500).json({
            error:
                e instanceof Error
                    ? e.message
                    : 'An unknown error occurred continuing the fight',
        })
    }
}
