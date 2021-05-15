import React, { memo, useEffect, useRef, useState } from 'react'
import useStyle from 'components/PlusOnes/PlusOnes.style'
import { Choice, UsersPictures } from 'components/Questioning/types'

const PlusOne = memo(
  ({
    trigger,
    isUpDirection,
    picUrl,
    timeout,
  }: {
    trigger: number
    isUpDirection: boolean
    picUrl: string | null
    timeout: number
  }) => {
    const classes = useStyle({ isUpDirection })
    const [unleashPower, setUnleashPower] = useState(false)
    useEffect(() => {
      setTimeout(() => setUnleashPower(true), timeout)
    }, [])

    if (!unleashPower) {
      return null
    }

    return (
      <React.Fragment>
        {!picUrl ? (
          <div key={trigger} className={classes.plusOne}>
            +1
          </div>
        ) : (
          <img
            key={trigger}
            className={`${classes.plusOne} ${classes.picture}`}
            width="32px"
            src={picUrl}
            alt="choser"
          />
        )}
      </React.Fragment>
    )
  },
)

const PlusOnes = ({
  usersAnswers,
  choice,
  option,
  usersPictures,
}: {
  option: Choice
  choice: Choice | undefined | null
  usersAnswers: number[] | null
  usersPictures?: UsersPictures | null
}) => {
  const [delayedUsersAnswers, setDelayedUserAnswers] = useState<{ id: number; timeout: number }[]>([])
  const displayed = useRef<Record<number, number>>({})
  /* eslint-disable complexity */
  useEffect(() => {
    if (!choice || !usersAnswers) {
      setDelayedUserAnswers([])
      displayed.current = {}
      return
    }
    const toDisplay: { id: number; timeout: number }[] = []
    const rememberDisplayed: Record<number, number> = {}

    let timeoutFactor = 0
    const interval = Math.min(3000 / usersAnswers.length, 100)

    usersAnswers.forEach((userId) => {
      if (userId in displayed.current) {
        toDisplay.push({ id: userId, timeout: displayed.current[userId] })
        rememberDisplayed[userId] = displayed.current[userId]
      } else {
        const timeout = interval * timeoutFactor
        rememberDisplayed[userId] = timeout
        toDisplay.push({ id: userId, timeout: timeout })
        timeoutFactor += 1
      }
    })

    setDelayedUserAnswers(toDisplay)
    displayed.current = rememberDisplayed
  }, [usersAnswers, choice])

  if (choice && delayedUsersAnswers.length > 0) {
    return (
      <React.Fragment>
        {delayedUsersAnswers.map(({ id: userId, timeout }) => {
          const picUrl = usersPictures && usersAnswers ? usersPictures[userId] ?? null : null
          return (
            <PlusOne key={userId} trigger={userId} isUpDirection={option === 1} picUrl={picUrl} timeout={timeout} />
          )
        })}
      </React.Fragment>
    )
  }

  return null
}
export default PlusOnes
