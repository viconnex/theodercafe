import useStyle from 'components/PlusOnes/PlusOnes.style'
import { Choice, QuestioningAnswers } from 'components/Questioning/types'
import React, { memo } from 'react'

const PlusOne = memo(({ update, isUpDirection }: { update: number; isUpDirection: boolean }) => {
  const classes = useStyle({ isUpDirection })
  return (
    <div key={update} className={classes.plusOne}>
      +1
    </div>
  )
})

const PlusOnes = ({
  update,
  questioningAnswers,
  choice,
  option,
}: {
  update: number
  option: Choice
  choice: Choice | null
  questioningAnswers?: QuestioningAnswers | null
}) => {
  if (update > 0) {
    return <PlusOne isUpDirection={option === 1} update={update} />
  }
  const field = `choice${option}` as keyof QuestioningAnswers

  if (choice && questioningAnswers) {
    return (
      <React.Fragment>
        {Array.from({ length: questioningAnswers[field] }, (_, i) => i).map((i) => {
          return <PlusOne key={i} update={i} isUpDirection={option === 1} />
        })}
      </React.Fragment>
    )
  }
  return null
}
export default PlusOnes
