import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import ArrowBack from '@material-ui/icons/ArrowBack'
import ArrowForward from '@material-ui/icons/ArrowForward'

import useStyle from './browser.style'

const Browser = ({
  questionIndex,
  changeQuestion,
  questionLength,
  hideArrows,
}: {
  questionIndex: number
  changeQuestion: (inc: number) => void
  questionLength: number
  hideArrows?: boolean
}) => {
  const classes = useStyle()

  return (
    <div className={classes.asakaibrowser}>
      <div className={classes.counter}>{`${questionIndex + 1} / ${questionLength}`}</div>
      <React.Fragment>
        <IconButton
          disabled={questionIndex === 0 || hideArrows}
          classes={{ root: classes.nextButton }}
          onClick={() => changeQuestion(-1)}
        >
          <ArrowBack />
        </IconButton>
        <IconButton classes={{ root: classes.nextButton }} disabled={hideArrows} onClick={() => changeQuestion(1)}>
          <ArrowForward />
        </IconButton>
      </React.Fragment>
    </div>
  )
}

export default Browser
