import { QuestionResponse } from 'components/Questioning/types'

export const ASAKAI_MODE = 'asakai'
export const ALL_QUESTIONS_MODE = 'all'

export const NOT_ANSWERED = 'notAnswered'
export const ALL_QUESTIONS_OPTION = 'all'
export const VALIDATED_OPTION = 'validated'
const IN_VALIDATION_OPTION = 'inValidation'
const NOT_VALIDATED_OPTION = 'notValidated'

export const FILTER_OPTIONS = [
  { value: VALIDATED_OPTION, label: 'Validées', isValidated: true },
  { value: NOT_ANSWERED, label: 'Pas encore répondu', isValidated: null },
  { value: ALL_QUESTIONS_OPTION, label: 'Toutes les questions', isValidated: true },
  { value: IN_VALIDATION_OPTION, label: 'En attente de validation', isValidated: null },
  { value: NOT_VALIDATED_OPTION, label: 'Invalidées', isValidated: false },
]

export const ASAKAI_QUESTION_COUNT = 10

export const MBTI_CATEGORY_NAME = 'MBTI'

export const MBTI_EXTRAVERSION = 'Extraverti (E)'
export const MBTI_INTROVERSION = 'Introverti (I)'
export const MBTI_SENSATION = 'Sensation (S)'
export const MBTI_INTUITION = 'Intuition (N)'
export const MBTI_THINKING = 'Thinking (T)'
export const MBTI_FEELING = 'Feeling (F)'
export const MBTI_JUGEMENT = 'Jugement (J)'
export const MBTI_PERCEPTION = 'Perception (P)'

const MBTI_SORT = {
  [MBTI_EXTRAVERSION]: 0,
  [MBTI_INTROVERSION]: 0,
  [MBTI_SENSATION]: 1,
  [MBTI_INTUITION]: 1,
  [MBTI_THINKING]: 2,
  [MBTI_FEELING]: 2,
  [MBTI_JUGEMENT]: 3,
  [MBTI_PERCEPTION]: 3,
}
export const sortMBTI = (question1: QuestionResponse, question2: QuestionResponse) => {
  // eslint-disable-next-line
  // @ts-ignore
  return MBTI_SORT[question1.option1] - MBTI_SORT[question2.option2] || 0
}

export const MBTI_ARCHITECT = 'INTJ'
export const MBTI_LOGICIAN = 'INTP'
export const MBTI_COMMANDER = 'ENTJ'
export const MBTI_DEBATER = 'ENTP'
export const MBTI_LOGISTICIAN = 'ISTJ'
export const MBTI_DEFENDER = 'ISFJ'
export const MBTI_EXECUTIVE = 'ESTJ'
export const MBTI_CONSUL = 'ESFJ'
export const MBTI_ADVOCATE = 'INFJ'
export const MBTI_MEDIATOR = 'INFP'
export const MBTI_PROTAGONIST = 'ENFJ'
export const MBTI_CAMPAIGNER = 'ENFP'
export const MBTI_VIRTUOSO = 'ISTP'
export const MBTI_ADVENTURER = 'ISFP'
export const MBTI_ENTREPRENEUR = 'ESTP'
export const MBTI_ENTERTAINER = 'ESFP'

export const MBTI_TYPES = {
  [MBTI_ARCHITECT]: {
    name: 'Architecte',
    description: 'Penseurs imaginatifs et stratèges, avec un plan pour tout.',
  },
  [MBTI_LOGICIAN]: {
    name: 'Logicien',
    description: 'Inventeurs innovateurs dotés d’une soif inextinguible de connaissances.',
  },
  [MBTI_COMMANDER]: {
    name: 'Commandant',
    description:
      'Leaders hardis, imaginatifs et dotés d’un fort caractère, qui trouvent toujours un moyen d’arriver à leurs fins, ou le créent.',
  },
  [MBTI_DEBATER]: {
    name: 'Innovateur',
    description: 'Penseurs astucieux et curieux incapables de résister à un défi intellectuel.',
  },
  [MBTI_LOGISTICIAN]: {
    name: 'Logisticien',
    description: 'Individus pragmatiques et intéressés par les faits, dont le sérieux ne saurait être mis en cause.',
  },
  [MBTI_DEFENDER]: {
    name: 'Défenseur',
    description: 'Protecteurs très dévoués et très chaleureux, toujours prêts à défendre ceux qu’ils aiment.',
  },
  [MBTI_EXECUTIVE]: {
    name: 'Directeur',
    description:
      'Excellents gestionnaires, d’une efficacité inégalée quand il s’agit de gérer les choses, ou les gens.',
  },
  [MBTI_CONSUL]: {
    name: 'Consul',
    description:
      'Personnes extraordinairement attentionnées, sociables et populaires, toujours prêtes à aider les autres.',
  },
  [MBTI_ADVOCATE]: {
    name: 'Avocat',
    description: 'Idéalistes calmes et mystiques et pourtant très inspirants et infatigables.',
  },
  [MBTI_MEDIATOR]: {
    name: 'Médiateur',
    description: 'Personnes poétiques, gentilles et altruistes qui sont toujours prêtes à soutenir une bonne cause.',
  },
  [MBTI_PROTAGONIST]: {
    name: 'Protagoniste',
    description: 'Leaders charismatiques et inspirants, capables de fasciner leur public.',
  },
  [MBTI_CAMPAIGNER]: {
    name: 'Inspirateur',
    description:
      'Esprits libres enthousiastes, créatifs et sociables, qui arrivent toujours à trouver une raison de sourire.',
  },
  [MBTI_VIRTUOSO]: {
    name: 'Virtuose',
    description: 'Expérimentateurs hardis et pragmatiques, maîtres de toutes sortes d’outils.',
  },
  [MBTI_ADVENTURER]: {
    name: 'Aventurier',
    description: 'Artistes flexibles et charmants, toujours prêts à explorer et à essayer quelque chose de nouveau.',
  },
  [MBTI_ENTREPRENEUR]: {
    name: 'Entrepreneur',
    description:
      'Personnes astucieuses, énergiques et très perspicaces, qui aiment vraiment vivre à la pointe du progrès.',
  },
  [MBTI_ENTERTAINER]: {
    name: 'Amuseur',
    description: 'Amuseurs spontanés, énergiques et enthousiastes; avec eux, on ne s’ennuie jamais.',
  },
}
