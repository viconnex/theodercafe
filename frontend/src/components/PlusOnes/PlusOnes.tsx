import useStyle from 'components/PlusOnes/PlusOnes.style'
import { Choice } from 'components/Questioning/types'
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
  answersCount,
  choice,
  option,
}: {
  update: number
  option: Choice
  choice: Choice | undefined
  answersCount: number | null
}) => {
  if (update > 0) {
    return <PlusOne isUpDirection={option === 1} update={update} />
  }

  if (choice && answersCount !== null) {
    return (
      <React.Fragment>
        {Array.from({ length: answersCount }, (_, i) => i).map((i) => {
          return <PlusOne key={i} update={i} isUpDirection={option === 1} />
        })}
      </React.Fragment>
    )
  }
  return null
}
export default PlusOnes
