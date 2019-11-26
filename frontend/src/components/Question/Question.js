import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

import style from './style';
import { PlusOne } from 'components/PlusOne';

const Question = ({ classes, question, choice, chose, plusOneEnabled }) => {
  const [choice1Trigger, setChoice1Trigger] = React.useState(0);
  const [choice2Trigger, setChoice2Trigger] = React.useState(0);

  const handleChoice = (questionId, choice) => {
    chose(questionId, choice);
    if (!plusOneEnabled) return;
    if (choice === 1) setChoice1Trigger(choice1Trigger + 1);
    else if (choice === 2) setChoice2Trigger(choice2Trigger + 1);
  };

  return (
    <div>
      <div className={classes.categoryContainer}>
        <div className={classes.categoryTitle}>Catégorie</div>
        <Chip size="small" label={question.categoryName ? question.categoryName : 'hors catégorie'} color="primary" />
      </div>
      <div className={classes.questionContainer}>
        <div className={classes.optionContainer}>
          <div
            onClick={() => handleChoice(question.id, 1)}
            className={`${classes.option} ${choice === 1 ? classes.chosenQuestion : ''}`}
          >
            <span className={!choice ? classes.chosable : ''}>{question.option1}</span>
          </div>
          {plusOneEnabled && choice1Trigger > 0 && <PlusOne update={choice1Trigger} />}
        </div>
        <div className={classes.separator}> ou </div>
        <div className={classes.optionContainer}>
          <div
            onClick={() => handleChoice(question.id, 2)}
            className={`${classes.option} ${classes.option2} ${choice === 2 ? classes.chosenQuestion : ''}`}
          >
            <span className={!choice ? classes.chosable : ''}>{question.option2}</span>
          </div>
          {plusOneEnabled && choice2Trigger > 0 && <PlusOne update={choice2Trigger} />}
          <span style={{ padding: '8px' }}> ?</span>
        </div>
      </div>
    </div>
  );
};

export default withStyles(style)(Question);
