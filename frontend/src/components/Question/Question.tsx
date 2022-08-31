import React, { useRef } from 'react'
import Chip from '@material-ui/core/Chip'

import { PlusOnes } from 'components/PlusOnes'
import { Choice, QuestionResponse, UsersAnswers, UsersPictures } from 'components/Questioning/types'

import { FormattedMessage, useIntl } from 'react-intl'
import { getLocale, MBTI_OPTION_TRANSLATION } from 'languages/messages'

import useStyle, { useOptionStyle } from './style'

const getOptionTrad = (questionOption: string) => {
  if (questionOption in MBTI_OPTION_TRANSLATION) {
    // eslint-disable-next-line
    // @ts-ignore
    return MBTI_OPTION_TRANSLATION[questionOption][getLocale()] as { subtitle: string; option: string }
  }

  return { subtitle: null, option: questionOption }
}

/* eslint-disable complexity */
const Option = ({
  option,
  choice,
  usersAnswers,
  questionOption,
  questionId,
  chose,
  usersPictures,
}: {
  option: Choice
  choice: Choice | undefined | null
  usersAnswers?: UsersAnswers | null
  questionOption: string
  questionId: number
  chose: (id: number, choiceToHandle: Choice) => void
  usersPictures?: UsersPictures | null
}) => {
  const handleChoice = () => {
    chose(questionId, option)
  }

  const choiceField = `choice${option}` as keyof UsersAnswers
  const totalAnswers = usersAnswers ? usersAnswers.choice1.length + usersAnswers.choice2.length : 0
  const ratio =
    usersAnswers && totalAnswers > 0 ? Math.max(Math.min(usersAnswers[choiceField].length / totalAnswers, 1), 0) : null

  const showBar = !!usersAnswers && !!choice
  const previousRatio = useRef(0)
  const optionTrad = getOptionTrad(questionOption)

  const classes = useOptionStyle({
    isChoiceMade: !!choice,
    previousRatio: previousRatio.current,
    ratio,
    isChosenOption: choice === option,
    showBar,
    hasSubtitle: !!optionTrad?.subtitle,
  })

  previousRatio.current = !choice ? 0 : ratio ?? 0

  return (
    <div onClick={handleChoice} className={classes.container}>
      {showBar && usersAnswers && (
        <React.Fragment>
          <div className={`${classes.bar} ${classes.faded}`} />
          <div className={`${classes.number} ${classes.faded}`}>{usersAnswers[choiceField].length}</div>
        </React.Fragment>
      )}
      <div className={`${classes.textContainer} ${classes.faded}`}>
        <div className={classes.text}>
          <span className={classes.textContent}>{optionTrad.option}</span>
          <span>{option === 2 ? ' ?' : ''}</span>
        </div>
        {optionTrad?.subtitle && <div className={classes.subtitle}>{optionTrad?.subtitle}</div>}
      </div>
      <PlusOnes
        usersAnswers={usersAnswers ? usersAnswers[choiceField] : null}
        choice={choice}
        option={option}
        usersPictures={usersPictures}
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
  usersAnswers,
  usersPictures,
}: {
  question: QuestionResponse
  choice: Choice | undefined | null
  chose: (questionId: number, choiceToHandle: Choice) => void
  hideCategory?: boolean
  usersAnswers?: UsersAnswers | null
  usersPictures?: UsersPictures | null
}) => {
  const classes = useStyle()
  const intl = useIntl()

  return (
    <React.Fragment>
      {!hideCategory && (
        <div className={classes.categoryContainer}>
          <div className={classes.categoryTitle}>
            <FormattedMessage id="question.category.title" />
          </div>
          <Chip
            size="small"
            label={question.category?.name ?? intl.formatMessage({ id: 'question.category.noCategory' })}
            color="secondary"
          />
        </div>
      )}
      <Option
        option={1}
        choice={choice}
        usersAnswers={usersAnswers}
        questionOption={question.option1}
        questionId={question.id}
        chose={chose}
        usersPictures={usersPictures}
      />
      <div className={classes.separator}>ou</div>
      <Option
        option={2}
        choice={choice}
        usersAnswers={usersAnswers}
        questionOption={question.option2}
        questionId={question.id}
        chose={chose}
        usersPictures={usersPictures}
      />
    </React.Fragment>
  )
}

export default Question
