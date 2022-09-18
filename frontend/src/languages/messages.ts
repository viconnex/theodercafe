import { MBTI_OPTION } from 'utils/constants/questionConstants'

export enum Locale {
  fr = 'fr',
  en = 'en',
}

export const messages = {
  [Locale.fr]: {
    'allQuestioning.filters': 'Filtres',
    'allQuestioning.filters.MBTI': 'MBTI',
    'allQuestioning.MBTI.seeProfiles': 'Voir les profils',
    'allQuestioning.awaitingValidation': 'Question en attente de validation',
    'allQuestioning.noQuestion': 'Aucune question pour les filtres sélectionnés',
    'allQuestioning.notValidated': 'Question invalidée',
    'allQuestioning.validated': 'Question validée',
    'asakai.activateLive': 'Connecte-toi pour activer le live',
    'asakai.changeTodaySet': 'Changer le set du jour',
    'asakai.finish.error': "Une erreur s'est produite 🛸",
    'asakai.finish.feedback': 'Donne ton avis !',
    'asakai.finish.feedback.here': '🦉 ici 🦑',
    'asakai.modeSelector.coach': 'Mode Coach',
    'asakai.modeSelector.coach.tooltip':
      'En mode Coach, les réponses ne sont pas enregistrées sur ton compte. Renseigne un email à la fin du questionnaire pour les enregistrer sur un nouveau compte',
    'filter.isAnswered': 'Déjà répondues',
    'filter.isInValidation': 'En attente de validation',
    'filter.isJoke': 'Blagues',
    'filter.isJokeOnSomeone': 'Blagues sur les Theodoers',
    'filter.isMBTI': 'MBTI',
    'filter.isNotAnswered': 'Pas encore répondues',
    'filter.isNotJoke': 'Non blagues',
    'filter.isNotJokeOnSomeone': 'Pas de blagues sur les Theodoers',
    'filter.isNotValidated': 'Invalidées',
    'filter.title': 'Filtes',
    'filter.validated': "Validées pour l'asakai",
    'home.login': 'Login',
    'home.menu.about': 'À propos',
    'home.menu.admin': 'Admin',
    'home.menu.map': 'La carte',
    'home.menu.mbti': 'MBTI',
    'home.menu.myAlterodo': 'Mon alterodo',
    'home.menu.settings': 'Réglages',
    'home.modeSelector.title': 'Mode Live',
    'home.modeSelector.tooltip': 'Un set de 10 questions qui change tous les jours',
    'privateRoute.loginGoogle': 'Login avec Google',
    'privateRoute.mustBeAdmin': 'Tu dois être admin pour accéder à cette page',
    'privateRoute.mustBeConnected': 'Il faut te connecter pour voir cette page',
    'question.category.noCategory': 'Hors catégorie',
    'question.category.title': 'Catégorie',
    'question.or': 'ou',
    'asakai.finish.noOtherUserAnswer':
      "Ton Alterodo ne peut pas être affiché car aucun utilisateur de {company} n'a répondu à ces questions",
    'settings.questionSet': 'Set de questions',
  },
  [Locale.en]: {
    'allQuestioning.filters': 'Filters',
    'allQuestioning.filters.MBTI': 'MBTI',
    'allQuestioning.awaitingValidation': 'Question awaiting validation',
    'allQuestioning.MBTI.seeProfiles': 'See profiles',
    'allQuestioning.noQuestion': 'There is no question for the configured filters',
    'allQuestioning.notValidated': 'Question not validated',
    'allQuestioning.validated': 'Question validated',
    'asakai.activateLive': 'Login for live mode',
    'asakai.changeTodaySet': "Change today's set",
    'asakai.finish.error': 'An error occured 🛸',
    'asakai.finish.feedback': 'Give some feedback !',
    'asakai.finish.feedback.here': '🦉 here 🦑',
    'asakai.modeSelector.coach': 'Coach Mode',
    'asakai.modeSelector.coach.tooltip':
      'With Coach mode, answers are not saved on your account. Enter an email in the end so to save them on a new account',
    'filter.isAnswered': 'Already answered',
    'filter.isInValidation': 'Validation pending',
    'filter.isJoke': 'Jokes',
    'filter.isJokeOnSomeone': 'Puns on Theodoers',
    'filter.isMBTI': 'MBTI',
    'filter.isNotAnswered': 'Not yet answered',
    'filter.isNotJoke': 'No jokes',
    'filter.isNotJokeOnSomeone': 'No puns Theodoers',
    'filter.isNotValidated': 'Unvalidated',
    'filter.title': 'Filters',
    'filter.validated': 'Validated for asakai',
    'home.login': 'Login',
    'home.menu.about': 'About',
    'home.menu.admin': 'Admin',
    'home.menu.map': 'Map',
    'home.menu.mbti': 'MBTI',
    'home.menu.myAlterodo': 'My alterodo',
    'home.menu.settings': 'Settings',
    'home.modeSelector.title': 'Live Mode',
    'home.modeSelector.tooltip': 'A 10 question set updated everyday',
    'privateRoute.mustBeAdmin': 'You need to be an admin to have access to this page',
    'privateRoute.mustBeConnected': 'You need to be connected to see this page',
    'privateRoute.loginGoogle': 'Login with Google',
    'question.category.noCategory': 'No category',
    'question.category.title': 'Category',
    'question.or': 'or',
    'asakai.finish.noOtherUserAnswer':
      'The Alterodo cannot be displayed because no other users of {company} answered to these questions',
    'settings.questionSet': 'Question set',
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
