export enum Locale {
  fr = 'fr',
  en = 'en',
}

export const messages = {
  [Locale.fr]: {
    'home.modeSelector.tooltip': 'En mode Asakai, réponds à 10 questions pour connaître ton Alterodo',
  },
  [Locale.en]: {
    'home.modeSelector.tooltip': 'Asakai mode: answer 10 questions to find out your Alterodo',
  },
}

export const getLocale = () => {
  if (navigator.language.includes(Locale.en)) {
    return Locale.en
  }
  return Locale.fr
}
