import React, { useRef } from 'react'
import Chip from '@material-ui/core/Chip'

import { PlusOnes } from 'components/PlusOnes'
import { Choice, QuestionResponse, UsersAnswers, UsersPictures } from 'components/Questioning/types'
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
  const [plusOneTrigger, setPlusOneTrigger] = React.useState(0)

  const handleChoice = () => {
    chose(questionId, option)

    if (choice === option) {
      return
    }

    if (usersAnswers) {
      return // let PlusOne updates come from realtime updates
    }

    setPlusOneTrigger(plusOneTrigger + 1)
  }

  const choiceField = `choice${option}` as keyof UsersAnswers
  const totalAnswers = usersAnswers ? usersAnswers.choice1.length + usersAnswers.choice2.length : 0
  const ratio =
    usersAnswers && totalAnswers > 0 ? Math.max(Math.min(usersAnswers[choiceField].length / totalAnswers, 1), 0) : null

  const showBar = !!usersAnswers && !!choice
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
      {showBar && usersAnswers && (
        <React.Fragment>
          <div className={classes.bar} />
          <div className={classes.number}>{usersAnswers[choiceField].length}</div>
        </React.Fragment>
      )}
      <div className={classes.textContainer}>
        <div className={classes.text}>{questionOption}</div>
        {mbtiSubtitle && <div className={classes.subtitle}>{mbtiSubtitle}</div>}
      </div>
      <PlusOnes
        usersAnswers={usersAnswers ? usersAnswers[choiceField] : null}
        choice={choice}
        option={option}
        trigger={plusOneTrigger}
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
