import React, { useRef } from 'react'
import Chip from '@material-ui/core/Chip'

import { PlusOnes } from 'components/PlusOnes'
import { Choice, QuestioningAnswers, QuestionResponse } from 'components/Questioning/types'
import useStyle, { useOptionStyle } from './style'

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
  choice: Choice | undefined
  questioningAnswers?: QuestioningAnswers | null
  questionOption: string
  questionId: number
  chose: (id: number, choiceToHandle: Choice) => void
}) => {
  const [choiceTrigger, setChoiceTrigger] = React.useState(0)

  const handleChoice = () => {
    if (choice === option) {
      return
    }
    chose(questionId, option)

    if (questioningAnswers) {
      return // let PlusOne updates come from realtime updates
    }

    setChoiceTrigger(choiceTrigger + 1)
  }

  const choiceField = `choice${option}` as keyof QuestioningAnswers
  const totalAnswers = (questioningAnswers?.choice1 ?? 0) + (questioningAnswers?.choice2 ?? 0)
  const ratio = questioningAnswers && totalAnswers > 0 ? questioningAnswers[choiceField] / totalAnswers : null

  const showBar = !!questioningAnswers && !!choice
  const previousRatio = useRef(0)

  const classes = useOptionStyle({
    isChoiceMade: !!choice,
    previousRatio: previousRatio.current,
    ratio,
    isChosenOption: choice === option,
    showBar,
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
        <span className={classes.text}>{questionOption}</span>
      </div>
      <PlusOnes questioningAnswers={questioningAnswers} choice={choice} option={option} update={choiceTrigger} />
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
  choice: Choice | undefined
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
