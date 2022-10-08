import React, { useState } from 'react'

import MaterialButton from '@material-ui/core/Button'
import { IconButton, Tooltip } from '@material-ui/core'
import InfoIcon from '@material-ui/icons/Info'
import { Alterodos, UserAlterodoResponse } from 'components/Questioning/types'
import { FormattedMessage } from 'react-intl'
import useStyle from './style'

const SimilarityInfo = ({
  alterodo,
  isAlterodo,
  baseQuestionCount,
  sameOrDifferentAnswerCount,
}: {
  alterodo: UserAlterodoResponse
  isAlterodo: boolean
  baseQuestionCount: number
  sameOrDifferentAnswerCount: number
}) => {
  return (
    <div style={{ fontSize: '15px', padding: '8px', lineHeight: '16px' }}>
      <div>
        <FormattedMessage
          id="alterodo.similarityInfo.explanation"
          values={{
            alterodoGivenName: alterodo.givenName,
            baseQuestionCount,
            commonQuestionCount: alterodo.commonQuestionCount,
            sameOrDifferentAnswerCount,
            isAlterodo,
          }}
        />
      </div>
      <div style={{ marginTop: '8px' }}>
        <FormattedMessage
          id="alterodo.similarityInfo.result"
          values={{ alterodoGivenName: alterodo.givenName, isAlterodo }}
        />
      </div>
      <div style={{ marginTop: '8px' }}>
        {sameOrDifferentAnswerCount} / ( √{alterodo.commonQuestionCount} * √{baseQuestionCount} )
      </div>
    </div>
  )
}

const AlterodoTag = (chunks: string) => <span style={{ fontStyle: 'italic' }}>{chunks}</span>

const Alterodo = ({
  alterodo,
  isAlterodo,
  baseQuestionCount,
  isAsakai,
}: {
  alterodo: UserAlterodoResponse
  isAlterodo: boolean
  baseQuestionCount: number
  isAsakai: boolean
}) => {
  const sameOrDifferentAnswerCount = isAlterodo
    ? alterodo.sameAnswerCount
    : alterodo.commonQuestionCount - alterodo.sameAnswerCount

  const classes = useStyle()
  return (
    <div>
      <div>
        {isAsakai ? (
          <FormattedMessage id="alterodo.title.today" values={{ alterodoTag: AlterodoTag, isAlterodo }} />
        ) : (
          <FormattedMessage id="alterodo.title.general" values={{ alterodoTag: AlterodoTag, isAlterodo }} />
        )}
      </div>
      <img className={classes.picture} src={alterodo.pictureUrl} alt="alterodo profile" />
      <div className={classes.name}>
        {alterodo.givenName} {alterodo.familyName}
      </div>
      <div className={classes.similarity}>
        {isAlterodo ? <FormattedMessage id="alterodo.similarity" /> : <FormattedMessage id="alterodo.diversity" />}
        <span className={classes.similarityValue}>{Math.round(alterodo.similarity * 100)} %</span>
        <Tooltip
          title={
            <SimilarityInfo
              alterodo={alterodo}
              isAlterodo={isAlterodo}
              baseQuestionCount={baseQuestionCount}
              sameOrDifferentAnswerCount={sameOrDifferentAnswerCount}
            />
          }
          enterTouchDelay={0}
          leaveTouchDelay={5000}
        >
          <IconButton color="secondary" classes={{ root: classes.infoButton }}>
            <InfoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  )
}

const AlterodoWrapper = ({
  alterodos,
  resetQuestioning,
  isAsakai,
  className,
}: {
  alterodos: Alterodos
  resetQuestioning: () => void
  isAsakai: boolean
  className: string
}) => {
  const [alterodo, setAlterodo] = useState(alterodos.alterodo)
  const [isAlterodoDisplayed, setIsAlterodoDisplayed] = useState(true)

  const changeAlterodo = () => {
    if (isAlterodoDisplayed) {
      setAlterodo(alterodos.varieto)
      setIsAlterodoDisplayed(false)
    } else {
      setAlterodo(alterodos.alterodo)
      setIsAlterodoDisplayed(true)
    }
  }
  const classes = useStyle()

  if (alterodos.baseQuestionCount === 0) {
    return (
      <div>
        <FormattedMessage id="alterodo.undefined.noAnswer" />
      </div>
    )
  }

  if (!alterodos.alterodo.sameAnswerCount) {
    return (
      <div>
        <FormattedMessage id="alterodo.undefined.noSameQuestion" />
      </div>
    )
  }

  return (
    <div className={className}>
      <Alterodo
        alterodo={alterodo}
        isAlterodo={isAlterodoDisplayed}
        baseQuestionCount={alterodos.baseQuestionCount}
        isAsakai={isAsakai}
      />
      <div className={classes.actionsContainer}>
        <div>
          <MaterialButton variant="contained" size="small" fullWidth={false} color="secondary" onClick={changeAlterodo}>
            <FormattedMessage id="alterodo.switchButton" values={{ isAlterodo: isAlterodoDisplayed }} />
          </MaterialButton>
        </div>
        <div>
          <MaterialButton className={classes.newQuestioning} size="small" color="secondary" onClick={resetQuestioning}>
            <FormattedMessage id="alterodo.backToQuestions" />
          </MaterialButton>
        </div>
      </div>
    </div>
  )
}

export default AlterodoWrapper
