import React from 'react'
import Chip from '@material-ui/core/Chip'

import { PlusOne } from 'components/PlusOne'
import { Choice, QuestioningAnswers, QuestionResponse } from 'components/Questioning/types'
import useStyle from './style'

const getAnswersRatio = (answers: QuestioningAnswers) => {
  return {
    choice1: answers.choice1 / (answers.choice1 + answers.choice2),
    choice2: answers.choice2 / (answers.choice1 + answers.choice2),
  }
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
  const classes = useStyle()
  const questioningRatio = getAnswersRatio(questioningAnswers)
  const choiceField = `choice${option}` as keyof QuestioningAnswers
  return (
    <div
      className={`${classes.questioningAnswersContainer} ${choice === 1 ? classes.questioningAnswersContainerTop : ''}`}
    >
      <div
        className={classes.questioningAnswersBar}
        style={{
          width: `${Math.round(questioningRatio[choiceField] * 100)}%`,
        }}
      />
      <div className={classes.questioningAnswersNumber}>{questioningAnswers[choiceField]}</div>
    </div>
  )
}

/* eslint-disable complexity */
const Question = ({
  question,
  choice,
  chose,
  plusOneEnabled,
  hideCategory,
  questioningAnswers,
}: {
  question: QuestionResponse
  choice: Choice | null
  chose: (questionId: number, choiceToHandle: Choice) => void
  plusOneEnabled: boolean
  hideCategory?: boolean
  questioningAnswers?: QuestioningAnswers | null
}) => {
  const [choice1Trigger, setChoice1Trigger] = React.useState(0)
  const [choice2Trigger, setChoice2Trigger] = React.useState(0)

  const classes = useStyle()

  const handleChoice = (questionId: number, choiceToHandle: Choice) => {
    chose(questionId, choiceToHandle)
    if (!plusOneEnabled) {
      return
    }
    if (choiceToHandle === 1) {
      setChoice1Trigger(choice1Trigger + 1)
    } else if (choiceToHandle === 2) {
      setChoice2Trigger(choice2Trigger + 1)
    }
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
          {plusOneEnabled && choice1Trigger > 0 && <PlusOne update={choice1Trigger} />}
        </div>
        <div className={classes.separator}> ou </div>
        <div className={classes.optionContainer}>
          <div
            onClick={() => handleChoice(question.id, 2)}
            className={`${classes.option} ${classes.option2} ${choice === 2 ? classes.chosenQuestion : ''}`}
          >
            <span className={!choice ? classes.chosable : ''}>{question.option2}</span>
          </div>
          {plusOneEnabled && choice2Trigger > 0 && <PlusOne update={choice2Trigger} />}
          <span style={{ padding: '8px' }}> ?</span>
        </div>
        {questioningAnswers && <AnswerBar questioningAnswers={questioningAnswers} option={2} choice={choice} />}
      </div>
    </React.Fragment>
  )
}

export default Question
