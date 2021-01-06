import React from 'react'
import Chip from '@material-ui/core/Chip'

import { PlusOnes } from 'components/PlusOnes'
import { Choice, QuestioningAnswers, QuestionResponse } from 'components/Questioning/types'
import colors from 'ui/colors'
import { ChoiceTrigger } from 'components/Question/types'
import useStyle, { useAnswerBarStyle } from './style'

const getNumberOffset = (number: number) => {
  const base = 7
  const offset = 5
  if (number <= 1) {
    return base + offset
  }
  return (Math.floor(Math.log10(number)) + 1) * base + offset
}

const AnswerBar = ({
  option,
  choice,
  questioningAnswers,
}: {
  option: Choice
  choice: Choice | null
  questioningAnswers: QuestioningAnswers
}) => {
  const classes = useAnswerBarStyle({ isChoiceMade: !!choice, option })
  const choiceField = `choice${option}` as keyof QuestioningAnswers
  const ratio = questioningAnswers[choiceField] / (questioningAnswers.choice1 + questioningAnswers.choice2)

  return (
    <div className={`${classes.container}`}>
      <div
        className={classes.bar}
        style={{
          width: `${Math.round(ratio * 100)}%`,
          minWidth: `${getNumberOffset(ratio * 100) + 10}px`,
          backgroundColor: ratio === 0 ? 'rgba(0,0,0,0)' : undefined,
          color: ratio === 0 ? colors.theodoGreen : undefined,
        }}
      >
        {`${Math.round(ratio * 100)}%`}
        {questioningAnswers[choiceField] > 0 && (
          <div className={classes.number} style={{ right: `-${getNumberOffset(questioningAnswers[choiceField])}px` }}>
            {questioningAnswers[choiceField]}
          </div>
        )}
      </div>
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
  choice: Choice | null
  chose: (questionId: number, choiceToHandle: Choice) => void
  hideCategory?: boolean
  questioningAnswers?: QuestioningAnswers | null
}) => {
  const [choiceTrigger, setChoiceTrigger] = React.useState<ChoiceTrigger>({ choice1: 0, choice2: 0 })

  const classes = useStyle()

  const handleChoice = (questionId: number, choiceToHandle: Choice) => {
    if (choice === choiceToHandle) {
      return
    }
    chose(questionId, choiceToHandle)

    if (questioningAnswers) {
      return // let PlusOne updates come from realtime updates
    }

    const field = `choice${choiceToHandle}` as keyof ChoiceTrigger
    setChoiceTrigger({ ...choiceTrigger, [field]: choiceTrigger[field] + 1 })
  }

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
      <div className={classes.questionContainer}>
        {questioningAnswers && <AnswerBar questioningAnswers={questioningAnswers} option={1} choice={choice} />}
        <div className={classes.optionContainer}>
          <div
            onClick={() => handleChoice(question.id, 1)}
            className={`${classes.option} ${choice === 1 ? classes.chosenQuestion : ''}`}
          >
            <span className={!choice ? classes.chosable : ''}>{question.option1}</span>
          </div>
          <PlusOnes questioningAnswers={questioningAnswers} choice={choice} option={1} update={choiceTrigger.choice1} />
        </div>
        <div className={classes.separator}> ou </div>
        <div className={classes.optionContainer}>
          <div
            onClick={() => handleChoice(question.id, 2)}
            className={`${classes.option} ${classes.option2} ${choice === 2 ? classes.chosenQuestion : ''}`}
          >
            <span className={!choice ? classes.chosable : ''}>{question.option2}</span>
          </div>
          <PlusOnes questioningAnswers={questioningAnswers} choice={choice} option={2} update={choiceTrigger.choice2} />

          <span style={{ padding: '8px' }}> ?</span>
        </div>
        {questioningAnswers && <AnswerBar questioningAnswers={questioningAnswers} option={2} choice={choice} />}
      </div>
    </React.Fragment>
  )
}

export default Question
