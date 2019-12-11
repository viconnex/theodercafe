import React, { useState } from 'react';
import { withStyles } from '@material-ui/styles';

import style from './style';
import MaterialButton from '@material-ui/core/Button';

const getAlterodoName = isAlterodo => (isAlterodo ? 'Alterodo' : 'Varieto');

const Alterodo = ({ alterodo, classes, isAlterodo }) => {
  return (
    <div>
      <div>
        Ton <span style={{ fontStyle: 'italic' }}>{getAlterodoName(isAlterodo)}</span> est
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
    </div>
  );
};

const AlterodoWrapper = ({ alterodos, classes, resetQuestioning }) => {
  const [alterodo, setAlterodo] = useState(alterodos.alterodo);
  const [isAlterodoDisplayed, setIsAlterodoDisplayed] = useState(true);

  const changeAlterodo = () => {
    if (isAlterodoDisplayed) {
      setAlterodo(alterodos.varieto);
      setIsAlterodoDisplayed(false);
    } else {
      setAlterodo(alterodos.alterodo);
      setIsAlterodoDisplayed(true);
    }
  };

  return (
    <div>
      <Alterodo classes={classes} alterodo={alterodo} isAlterodo={isAlterodoDisplayed} />
      <div className={classes.actionsContainer}>
        <div>
          <MaterialButton variant="contained" size="small" fullWidth={false} color="secondary" onClick={changeAlterodo}>
            Et ton {getAlterodoName(!isAlterodoDisplayed)} ?
          </MaterialButton>
        </div>
        <div>
          <MaterialButton className={classes.newQuestioning} size="small" color="secondary" onClick={resetQuestioning}>
            Recommencer le questionnaire
          </MaterialButton>
        </div>
      </div>
    </div>
  );
};

export default withStyles(style)(AlterodoWrapper);
