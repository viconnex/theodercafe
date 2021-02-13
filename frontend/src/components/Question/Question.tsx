import React, { useRef } from 'react'
import Chip from '@material-ui/core/Chip'

import { PlusOnes } from 'components/PlusOnes'
import { Choice, QuestioningAnswers, QuestionResponse } from 'components/Questioning/types'
import {
  MBTI_EXTRAVERSION,
  MBTI_FEELING,
  MBTI_INTROVERSION,
  MBTI_INTUITION,
  MBTI_JUGEMENT,
  MBTI_PERCEPTION,
  MBTI_SENSATION,
  MBTI_THINKING,
} from 'utils/constants/questionConstants'
import useStyle, { useOptionStyle } from './style'

const getMBTISubtitle = (questionOption: string) => {
  if (questionOption === MBTI_THINKING) {
    return 'Méthode, logique'
  } else if (questionOption === MBTI_FEELING) {
    return 'Empathie, soutien'
  } else if (questionOption === MBTI_JUGEMENT) {
    return 'Je planifie tout'
  } else if (questionOption === MBTI_PERCEPTION) {
    return "Je fais tout à l'arrache"
  } else if (questionOption === MBTI_SENSATION) {
    return 'Je préfère des faits précis'
  } else if (questionOption === MBTI_INTUITION) {
    return "J'aime avoir la vue d'ensemble"
  } else if (questionOption === MBTI_EXTRAVERSION) {
    return 'Je me ressource quand je suis avec les autres'
  } else if (questionOption === MBTI_INTROVERSION) {
    return 'Je me ressource quand je suis seul'
  }
  return null
}

/* eslint-disable complexity */
const Option = ({
  option,
  choice,
  questioningAnswers,
  questionOption,
  questionId,
  chose,
}: {
  option: Choice
  choice: Choice | undefined | null
  questioningAnswers?: QuestioningAnswers | null
  questionOption: string
  questionId: number
  chose: (id: number, choiceToHandle: Choice) => void
}) => {
  const [plusOneTrigger, setPlusOneTrigger] = React.useState(0)

  const handleChoice = () => {
    chose(questionId, option)

    if (choice === option) {
      return
    }

    if (questioningAnswers) {
      return // let PlusOne updates come from realtime updates
    }

    setPlusOneTrigger(plusOneTrigger + 1)
  }

  const choiceField = `choice${option}` as keyof QuestioningAnswers
  const totalAnswers = (questioningAnswers?.choice1 ?? 0) + (questioningAnswers?.choice2 ?? 0)
  const ratio =
    questioningAnswers && totalAnswers > 0
      ? Math.max(Math.min(questioningAnswers[choiceField] / totalAnswers, 1), 0)
      : null

  const showBar = !!questioningAnswers && !!choice
  const previousRatio = useRef(0)
  const mbtiSubtitle = getMBTISubtitle(questionOption)

  const classes = useOptionStyle({
    isChoiceMade: !!choice,
    previousRatio: previousRatio.current,
    ratio,
    isChosenOption: choice === option,
    showBar,
    hasSubtitle: !!mbtiSubtitle,
  })

  previousRatio.current = !choice ? 0 : ratio ?? 0

  return (
    <div onClick={handleChoice} className={classes.container}>
      {showBar && questioningAnswers && (
        <React.Fragment>
          <div className={classes.bar} />
          <div className={classes.number}>{questioningAnswers[choiceField]}</div>
        </React.Fragment>
      )}
      <div className={classes.textContainer}>
        <div className={classes.text}>{questionOption}</div>
        {mbtiSubtitle && <div className={classes.subtitle}>{mbtiSubtitle}</div>}
      </div>
      <PlusOnes
        answersCount={questioningAnswers ? questioningAnswers[choiceField] : null}
        choice={choice}
        option={option}
        trigger={plusOneTrigger}
      />
    </div>
  )
}

/* eslint-disable complexity */
const Question = ({
  question,
  choice,
  chose,
  hideCategory,
  questioningAnswers,
}: {
  question: QuestionResponse
  choice: Choice | undefined | null
  chose: (questionId: number, choiceToHandle: Choice) => void
  hideCategory?: boolean
  questioningAnswers?: QuestioningAnswers | null
}) => {
  const classes = useStyle()

  return (
    <React.Fragment>
      {!hideCategory && (
        <div className={classes.categoryContainer}>
          <div className={classes.categoryTitle}>Catégorie</div>
          <Chip
            size="small"
            label={question.categoryName ? question.categoryName : 'hors catégorie'}
            color="secondary"
          />
        </div>
      )}
      <Option
        option={1}
        choice={choice}
        questioningAnswers={questioningAnswers}
        questionOption={question.option1}
        questionId={question.id}
        chose={chose}
      />
      <div className={classes.separator}>ou</div>
      <Option
        option={2}
        choice={choice}
        questioningAnswers={questioningAnswers}
        questionOption={question.option2}
        questionId={question.id}
        chose={chose}
      />
    </React.Fragment>
  )
}

export default Question
