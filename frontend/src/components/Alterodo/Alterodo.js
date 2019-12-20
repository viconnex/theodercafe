import React, { useState } from 'react';
import { withStyles } from '@material-ui/styles';

import style from './style';
import MaterialButton from '@material-ui/core/Button';
import { Tooltip, IconButton } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';

const getAlterodoName = isAlterodo => (isAlterodo ? 'Alterodo' : 'Varieto');

const Alterodo = ({ alterodo, classes, isAlterodo }) => {
  const similarityInfo = (
    <div style={{ fontSize: '15px', padding: '8px', lineHeight: '16px' }}>
      <div>
        Lors de l'Asakai, tu réponds à 10 questions. {alterodo.user.givenName} a répondu à{' '}
        {alterodo.similarity.squareNorm} de ces questions, et a choisi la même réponse sur{' '}
        {alterodo.similarity.sameAnswerCount} d'entres elles.
      </div>
      <div style={{ marginTop: '8px' }}>Ta similarité avec {alterodo.user.givenName} est :</div>
      <div style={{ marginTop: '8px' }}>
        {alterodo.similarity.sameAnswerCount} / ( √{alterodo.similarity.squareNorm} * √10 )
      </div>
    </div>
  );
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
        <Tooltip title={similarityInfo} enterTouchDelay={0} leaveTouchDelay={3000}>
          <IconButton color="secondary" classes={{ root: classes.infoButton }}>
            <InfoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
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
