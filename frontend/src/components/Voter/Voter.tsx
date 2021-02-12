import React from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import ThumbUp from '@material-ui/icons/ThumbUp'
import ThumbDown from '@material-ui/icons/ThumbDown'
import { QuestionVote } from 'components/Questioning/types'
import useStyle from './style'

const Voter = ({
  questionId,
  questionVote,
  vote,
}: {
  questionId: number
  questionVote: QuestionVote | undefined
  vote: (questionId: number, isUpVote: boolean) => void
}) => {
  const classes = useStyle()
  let downVoteClass = classes.neutralVote
  let upVoteClass = classes.neutralVote

  const isUpVote = questionVote?.isUserUpVote
  if (isUpVote === true) {
    upVoteClass = classes.upVote
  } else if (isUpVote === false) {
    downVoteClass = classes.downVote
  }
  return (
    <div className={classes.voter}>
      <div className={classes.thumbContainer}>
        <Tooltip title="Je n'aime pas cette question">
          <IconButton
            className={downVoteClass}
            onClick={() => vote(questionId, false)}
            style={{ paddingBottom: '4px' }}
          >
            <ThumbDown />
          </IconButton>
        </Tooltip>
        {questionVote && <div className={classes.count}>{questionVote.downVoteCount ?? 0}</div>}
      </div>
      <div className={classes.thumbContainer}>
        <Tooltip title="J'aime cette question">
          <IconButton className={upVoteClass} onClick={() => vote(questionId, true)} style={{ paddingBottom: '4px' }}>
            <ThumbUp />
          </IconButton>
        </Tooltip>
        {questionVote && <div className={classes.count}>{questionVote.upVoteCount ?? 0}</div>}
      </div>
    </div>
  )
}

export default Voter
