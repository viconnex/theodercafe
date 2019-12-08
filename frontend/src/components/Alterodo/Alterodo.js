import React from 'react';
import { withStyles } from '@material-ui/styles';

import style from './style';
import { Button } from '@material-ui/core';

const Alterodo = ({ alterodo, classes, resetQuestioning }) => {
  return (
    <div>
      <div>
        Ton <span style={{ fontStyle: 'italic' }}>Alterodo</span> est
      </div>
      <img className={classes.picture} src={alterodo.user.pictureUrl} alt="alterodo_profile" />
      <div className={classes.name}>
        {alterodo.user.givenName} {alterodo.user.familyName}
      </div>
      <div className={classes.similarity}>
        Similarité :{' '}
        <span className={classes.similarityValue}>{Math.round(alterodo.similarity.similarity * 100)} %</span>
      </div>
      <div className={classes.similarity}>
        Sur
        <span className={classes.similarityValue}> {alterodo.similarity.squareNorm}</span> question
        {alterodo.similarity.squareNorm > 1 && 's'} en commun
      </div>
      <Button className={classes.newQuestioning} size="small" color="secondary" onClick={resetQuestioning}>
        Recommencer le questionnaire
      </Button>
    </div>
  );
};

export default withStyles(style)(Alterodo);
