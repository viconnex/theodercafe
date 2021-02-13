export const MBTI_EXTRAVERSION = 'Extraverti (E)'
export const MBTI_INTROVERSION = 'Introverti (I)'
export const MBTI_SENSATION = 'Sensation (S)'
export const MBTI_INTUITION = 'Intuition (N)'
export const MBTI_THINKING = 'Thinking (T)'
export const MBTI_FEELING = 'Feeling (F)'
export const MBTI_JUGEMENT = 'Jugement (J)'
export const MBTI_PERCEPTION = 'Perception (P)'

export const MBTI_INDEX_LETTERS_BY_OPTION_1 = {
    [MBTI_INTROVERSION]: {
        index: 0,
        1: 'I',
        2: 'E',
    },
    [MBTI_INTUITION]: {
        index: 1,
        1: 'N',
        2: 'S',
    },
    [MBTI_THINKING]: {
        index: 2,
        1: 'T',
        2: 'F',
    },
    [MBTI_JUGEMENT]: {
        index: 3,
        1: 'J',
        2: 'P',
    },
}

export type MbtiIndexAndLetters = {
    index: number
    1: string
    2: string
}
