import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import ThumbUp from '@material-ui/icons/ThumbUp';
import ThumbDown from '@material-ui/icons/ThumbDown';
import { fetchRequest } from 'utils/helpers';
import { withStyles } from '@material-ui/styles';
import { useSnackbar } from 'notistack';
import style from './style';

const Voter = ({ classes, questionId, hasVoted }) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleUpVote = (isUpVote, questionId) => async () => {
    const url = `/questions/${questionId}/upVote`;
    const body = { isUpVote };
    const response = await fetchRequest(url, 'PUT', body);
    if (response.status === 200) {
      enqueueSnackbar('Merci pour ton avis sur cette question', { variant: 'success' });
    }
  };

  return (
    <div className={classes.upVote}>
      <Tooltip title="Je n'aime pas cette question">
        <IconButton className={classes.neutralVoter} onClick={handleUpVote(false, questionId)} disabled={hasVoted}>
          <ThumbDown />
        </IconButton>
      </Tooltip>
      <Tooltip title="J'aime cette question">
        <IconButton className={classes.neutralVoter} onClick={handleUpVote(true, questionId)} disabled={hasVoted}>
          <ThumbUp />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default withStyles(style)(Voter);
