import _ from 'lodash'

export const getSmallSynonym = (): string => _.sample(small) ?? 'Unknown'
export const getModerateSynonym = (): string => _.sample(moderate) ?? 'Unknown'
export const getLargeSynonym = (): string => _.sample(large) ?? 'Unknown'
export const getHugeSynonym = (): string => _.sample(huge) ?? 'Unknown'

const small = [
    'small',
    'minor',
    'insignificant',
    'negligible',
    'slight',
    'tiny',
]
const moderate = ['moderate', 'reasonable', 'average', 'medium', 'limited']
const large = [
    'large',
    'extensive',
    'substantial',
    'major',
    'significant',
    'considerable',
]
const huge = ['huge', 'serious', 'severe', 'grave', 'critical', 'massive']
