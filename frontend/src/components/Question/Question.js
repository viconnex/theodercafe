import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

import { API_BASE_URL } from 'utils/constants';
import { fetchRequest } from 'utils/helpers';

import { PlusOne } from '../PlusOne';
import style from './style';

const Question = ({ classes, question }) => {
  const [state, setState] = React.useState({
    option1VoteTrigger: 0,
    option2VoteTrigger: 0,
  });
  const vote = choice => () => {
    setState({ ...state, [`option${choice}VoteTrigger`]: state[`option${choice}VoteTrigger`] + 1 });

    const url = API_BASE_URL + `/questions/${question.id}/choice`;
    const body = { choice };
    fetchRequest(url, 'PUT', body);
  };

  return (
    <div>
      <div className={classes.categoryContainer}>
        <div className={classes.categoryTitle}>Catégorie</div>
        <Chip
          variant="outlined"
          size="small"
          label={question.categoryName ? question.categoryName : 'hors catégorie'}
          className={classes.categoryContent}
        />
      </div>
      <div className={classes.questionContainer}>
        <div className={classes.optionContainer}>
          <div onClick={vote(1)} className={classes.questionPart}>
            <span className={classes.option}>{question.option1}</span>
          </div>
          {state.option1VoteTrigger > 0 && <PlusOne update={state.option1VoteTrigger} />}
        </div>
        <div className={classes.questionPart}> ou </div>
        <div className={classes.optionContainer}>
          <div onClick={vote(2)}>
            <span className={classes.option}>{question.option2}</span>
            <span> ?</span>
          </div>
          {state.option2VoteTrigger > 0 && <PlusOne update={state.option2VoteTrigger} />}
        </div>
      </div>
    </div>
  );
};

export default withStyles(style)(Question);
