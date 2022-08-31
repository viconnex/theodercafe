export enum Locale {
  fr = 'fr',
  en = 'en',
}

export const messages = {
  [Locale.fr]: {
    'home.modeSelector.title': 'Mode Live',
    'home.modeSelector.tooltip': 'Un set de 10 questions qui change tous les jours',
    'asakai.finish.error': "Une erreur s'est produite 🛸",
    'asakai.finish.feedback': 'Donne ton avis sur Theodercafe !',
    'asakai.finish.feedback.here': '🦉 ici 🦑',
    'asakai.modeSelector.coach': 'Mode Coach',
    'asakai.modeSelector.coach.tooltip':
      'En mode Coach, les réponses ne sont pas enregistrées sur ton compte. Renseigne un email à la fin du questionnaire pour les enregistrer sur un nouveau compte',
    'asakai.changeTodaySet': 'Changer le set du jour',
    'asakai.activateLive': 'Connecte-toi pour activer le live',
  },
  [Locale.en]: {
    'asakai.finish.error': 'An error occured 🛸',
    'home.modeSelector.title': 'Live Mode',
    'home.modeSelector.tooltip': 'A 10 question set updated everyday',
    'asakai.finish.feedback': 'Give some !',
    'asakai.finish.feedback.here': '🦉 here 🦑',
    'asakai.modeSelector.coach': 'Coach Mode',
    'asakai.modeSelector.coach.tooltip':
      'With Coach mode, answers are not saved on your account. Enter an email in the end so to save them on a new account',
    'asakai.changeTodaySet': "Change today's set",
    'asakai.activateLive': 'Login for live mode',
  },
}

export const getLocale = () => {
  if (navigator.language.includes(Locale.en)) {
    return Locale.en
  }
  return Locale.fr
}
