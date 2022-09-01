import { MBTI_OPTION } from 'utils/constants/questionConstants'

export enum Locale {
  fr = 'fr',
  en = 'en',
}

export const messages = {
  [Locale.fr]: {
    'asakai.activateLive': 'Connecte-toi pour activer le live',
    'asakai.changeTodaySet': 'Changer le set du jour',
    'asakai.finish.error': "Une erreur s'est produite 🛸",
    'asakai.finish.feedback': 'Donne ton avis !',
    'asakai.finish.feedback.here': '🦉 ici 🦑',
    'asakai.modeSelector.coach': 'Mode Coach',
    'asakai.modeSelector.coach.tooltip':
      'En mode Coach, les réponses ne sont pas enregistrées sur ton compte. Renseigne un email à la fin du questionnaire pour les enregistrer sur un nouveau compte',
    'home.modeSelector.title': 'Mode Live',
    'home.modeSelector.tooltip': 'Un set de 10 questions qui change tous les jours',
    'question.category.noCategory': 'Hors catégorie',
    'question.category.title': 'Catégorie',
    'allQuestioning.filters': 'Filtres',
    'allQuestioning.filters.MBTI': 'MBTI',
    'allQuestioning.MBTI.seeProfiles': 'Voir les profils',
  },
  [Locale.en]: {
    'asakai.finish.error': 'An error occured 🛸',
    'home.modeSelector.title': 'Live Mode',
    'home.modeSelector.tooltip': 'A 10 question set updated everyday',
    'asakai.finish.feedback': 'Give some feedback !',
    'asakai.finish.feedback.here': '🦉 here 🦑',
    'asakai.modeSelector.coach': 'Coach Mode',
    'asakai.modeSelector.coach.tooltip':
      'With Coach mode, answers are not saved on your account. Enter an email in the end so to save them on a new account',
    'asakai.changeTodaySet': "Change today's set",
    'asakai.activateLive': 'Login for live mode',
    'question.category.title': 'Category',
    'question.category.noCategory': 'No category',
    'allQuestioning.filters': 'Filters',
    'allQuestioning.filters.MBTI': 'MBTI',
    'allQuestioning.MBTI.seeProfiles': 'See profiles',
  },
}

export const getLocale = () => {
  if (navigator.language.includes(Locale.en)) {
    return Locale.en
  }
  return Locale.fr
}

export const MBTI_OPTION_TRANSLATION: {
  [key in MBTI_OPTION]: { [key in Locale]: { option: string; subtitle: string } }
} = {
  [MBTI_OPTION.MBTI_EXTRAVERSION]: {
    [Locale.fr]: { option: 'Extraverti (E)', subtitle: 'Je me ressource quand je suis avec les autres' },
    [Locale.en]: {
      option: 'Extraverted (E)',
      subtitle: 'I draw energy from action. I tend to act, then reflect, then act further.',
    },
  },
  [MBTI_OPTION.MBTI_INTROVERSION]: {
    [Locale.fr]: { option: 'Introverti (I)', subtitle: 'Je me ressource quand je suis seul' },
    [Locale.en]: {
      option: 'Introverted (I)',
      subtitle: 'I expend energy through action. I prefer to reflect, then act, then reflect again.',
    },
  },
  [MBTI_OPTION.MBTI_INTUITION]: {
    [Locale.fr]: { option: 'Intuition (N)', subtitle: "J'aime avoir la vue d'ensemble" },
    [Locale.en]: {
      option: 'Intuition (N)',
      subtitle: 'I like to have an overview. The meaning is in the underlying theory.',
    },
  },
  [MBTI_OPTION.MBTI_SENSATION]: {
    [Locale.fr]: { option: 'Sensation (S)', subtitle: 'Je préfère des faits précis' },
    [Locale.en]: {
      option: 'Sensing (S)',
      subtitle: 'I prefer to look for details and facts. The meaning is in the data',
    },
  },
  [MBTI_OPTION.MBTI_FEELING]: {
    [Locale.fr]: {
      option: 'Feeling (F)',
      subtitle: 'Je prends des décisions par empathie, soutien, en me projettant dans la situation',
    },
    [Locale.en]: {
      option: 'Feeling (F)',
      subtitle: 'I tend to come to decisions by associating or empathizing with the situation',
    },
  },
  [MBTI_OPTION.MBTI_THINKING]: {
    [Locale.fr]: {
      option: 'Thinking (T)',
      subtitle: 'Je prends des décisions en me basant sur ce qui me semble logique, raisonnable',
    },
    [Locale.en]: {
      option: 'Thinking (T)',
      subtitle:
        'I tend to decide things from a more detached standpoint, measuring the decision by what seems reasonable, logical, causal, consistent, and matching a given set of rules.',
    },
  },
  [MBTI_OPTION.MBTI_PERCEPTION]: {
    [Locale.fr]: {
      option: 'Perception (P)',
      subtitle: "Je fais tout à l'arrache",
    },
    [Locale.en]: {
      option: 'Perception (P)',
      subtitle: 'I do not plan anything',
    },
  },
  [MBTI_OPTION.MBTI_JUGEMENT]: {
    [Locale.fr]: {
      option: 'Jugement (J)',
      subtitle: 'Je planifie tout',
    },
    [Locale.en]: {
      option: 'Jugement (J)',
      subtitle: 'I plan everything',
    },
  },
}
