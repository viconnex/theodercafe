import React, { memo, useEffect, useState } from 'react'
import useStyle from 'components/PlusOnes/PlusOnes.style'
import { Choice } from 'components/Questioning/types'

const PlusOne = memo(({ trigger, isUpDirection }: { trigger: number; isUpDirection: boolean }) => {
  const classes = useStyle({ isUpDirection })
  return (
    <div key={trigger} className={classes.plusOne}>
      +1
    </div>
  )
})

const PlusOnes = ({
  trigger,
  answersCount,
  choice,
  option,
}: {
  trigger: number
  option: Choice
  choice: Choice | undefined | null
  answersCount: number | null
}) => {
  const [delayedTrigger, setDelayedTrigger] = useState(0)
  /* eslint-disable complexity */
  useEffect(() => {
    if (!choice) {
      setDelayedTrigger(0)
      return
    }

    if (choice && answersCount && answersCount > delayedTrigger) {
      const duration = Math.min(1000 / (answersCount - delayedTrigger), 100)
      for (let i = 0; i < answersCount - delayedTrigger; i++) {
        setTimeout(() => {
          setDelayedTrigger(delayedTrigger + 1 + i)
        }, i * duration)
      }
    } else if (answersCount && answersCount < delayedTrigger) {
      setDelayedTrigger(Math.max(answersCount, 0))
    } else if (!answersCount) {
      setDelayedTrigger(0)
    }
  }, [answersCount, choice])

  if (trigger > 0) {
    return <PlusOne isUpDirection={option === 1} trigger={trigger} />
  }
  if (choice && answersCount !== null && delayedTrigger > 0) {
    return (
      <React.Fragment>
        {Array.from({ length: delayedTrigger }, (_, i) => i).map((i) => {
          return <PlusOne key={i} trigger={i} isUpDirection={option === 1} />
        })}
      </React.Fragment>
    )
  }
  return null
}
export default PlusOnes
