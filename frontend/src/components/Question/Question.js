import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

import style from './style';

const Question = ({ classes, question, choice, chose }) => {
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
          <div
            onClick={() => chose(question.id, 1)}
            className={`${classes.questionPart} ${choice === 1 ? classes.chosenQuestion : ''}`}
          >
            <span className={classes.option}>{question.option1}</span>
          </div>
        </div>
        <div className={classes.questionPart}> ou </div>
        <div className={classes.optionContainer}>
          <div onClick={() => chose(question.id, 2)} className={`${choice === 2 ? classes.chosenQuestion : ''}`}>
            <span className={classes.option}>{question.option2}</span>
            <span> ?</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withStyles(style)(Question);
