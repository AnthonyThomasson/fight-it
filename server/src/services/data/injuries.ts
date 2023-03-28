import _ from 'lodash'
import { Injury } from './../game'

export const getInjury = (): Injury =>
    _.sample(injury) ?? { name: 'Unknown', severity: 0 }

const injury = [
    { name: 'Broken nose', severity: 4 },
    { name: 'Black eye', severity: 2 },
    { name: 'Swollen lip', severity: 2 },
    { name: 'Bloody nose', severity: 3 },
    { name: 'Cut above the eye', severity: 5 },
    { name: 'Bruised ribs', severity: 6 },
    { name: 'Sprained ankle', severity: 6 },
    { name: 'Sprained wrist', severity: 5 },
    { name: 'Dislocated jaw', severity: 8 },
    { name: 'Concussion', severity: 9 },
    { name: 'Broken teeth', severity: 5 },
    { name: 'Split eyebrow', severity: 6 },
    { name: 'Broken knuckles', severity: 7 },
    { name: 'Deep cut on the forehead', severity: 7 },
    { name: 'Swollen cheekbone', severity: 5 },
    { name: 'Sprained knee', severity: 8 },
    { name: 'Bruised liver', severity: 9 },
    { name: 'Broken collarbone', severity: 8 },
    { name: 'Torn muscle in the shoulder', severity: 9 },
    { name: 'Fractured orbital bone', severity: 9 },
]
