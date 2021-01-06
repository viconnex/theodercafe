import React from 'react'
import Chip from '@material-ui/core/Chip'

import { PlusOnes } from 'components/PlusOnes'
import { Choice, QuestioningAnswers, QuestionResponse } from 'components/Questioning/types'
import { ChoiceTrigger } from 'components/Question/types'
import useStyle, { useOptionStyle } from './style'

const getNumberOffset = (number: number) => {
  const base = 7
  const offset = 5
  if (number <= 1) {
    return base + offset
  }
  return (Math.floor(Math.log10(number)) + 1) * base + offset
}

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
  const ratio = questioningAnswers
    ? questioningAnswers[choiceField] / (questioningAnswers.choice1 + questioningAnswers.choice2)
    : null

  const showBar = !!questioningAnswers && !!choice
  const classes = useOptionStyle({ isChoiceMade: !!choice, ratio, isChosenOption: choice === option, showBar })

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
