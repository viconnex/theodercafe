export const ASAKAI_MODE = 'asakai';
export const ALL_QUESTIONS_MODE = 'all';

export const NOT_ANSWERED = 'notAnswered';
export const ALL_QUESTIONS_OPTION = 'all';
export const VALIDATED_OPTION = 'validated';
const IN_VALIDATION_OPTION = 'inValidation';
const NOT_VALIDATED_OPTION = 'notValidated';

export const FILTER_OPTIONS = [
  { value: VALIDATED_OPTION, label: 'Validées', isValidated: true },
  { value: NOT_ANSWERED, label: 'Pas encore répondu', isValidated: null },
  { value: ALL_QUESTIONS_OPTION, label: 'Toutes les questions', isValidated: true },
  { value: IN_VALIDATION_OPTION, label: 'En attente de validation', isValidated: null },
  { value: NOT_VALIDATED_OPTION, label: 'Invalidées', isValidated: false },
];

export const ASAKAI_QUESTION_COUNT = 10;
