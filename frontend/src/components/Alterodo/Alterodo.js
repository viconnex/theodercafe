import React, { useState } from "react";
import { withStyles } from "@material-ui/styles";

import style from "./style";
import MaterialButton from "@material-ui/core/Button";
import { Tooltip, IconButton } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";

const getAlterodoName = isAlterodo => (isAlterodo ? "Alterodo" : "Varieto");

const Alterodo = ({
  alterodo,
  classes,
  isAlterodo,
  baseQuestionCount,
  isAsakai
}) => {
  const sameOrDifferentAnswerCount = isAlterodo
    ? alterodo.sameAnswerCount
    : alterodo.commonQuestionCount - alterodo.sameAnswerCount;

  const similarityInfo = (
    <div style={{ fontSize: "15px", padding: "8px", lineHeight: "16px" }}>
      <div>
        Sur les {baseQuestionCount} questions auxquelles tu as répondu,{" "}
        {alterodo.givenName} a répondu à {alterodo.commonQuestionCount} de ces
        questions, et a choisi{" "}
        {isAlterodo ? "la même réponse" : "l'autre réponse"} sur{" "}
        {sameOrDifferentAnswerCount} d'entres elles.
      </div>
      <div style={{ marginTop: "8px" }}>
        Ta {isAlterodo ? "similarité" : "diversité"} avec {alterodo.givenName}{" "}
        est :
      </div>
      <div style={{ marginTop: "8px" }}>
        {sameOrDifferentAnswerCount} / ( √{alterodo.commonQuestionCount} * √
        {baseQuestionCount} )
      </div>
    </div>
  );
  return (
    <div>
      <div>
        Ton{" "}
        <span style={{ fontStyle: "italic" }}>
          {getAlterodoName(isAlterodo)}
        </span>
        {isAsakai && " du jour"} est
      </div>
      <img
        className={classes.picture}
        src={alterodo.pictureUrl}
        alt="alterodo_profile"
      />
      <div className={classes.name}>
        {alterodo.givenName} {alterodo.familyName}
      </div>
      <div className={classes.similarity}>
        {isAlterodo ? "Similarité" : "Diversité"} :{" "}
        <span className={classes.similarityValue}>
          {Math.round(alterodo.similarity * 100)} %
        </span>
        <Tooltip
          title={similarityInfo}
          enterTouchDelay={0}
          leaveTouchDelay={5000}
        >
          <IconButton color="secondary" classes={{ root: classes.infoButton }}>
            <InfoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>
      <div className={classes.similarity}>
        Sur
        <span className={classes.similarityValue}>
          {" "}
          {alterodo.commonQuestionCount}
        </span>{" "}
        question
        {alterodo.commonQuestionCount > 1 && "s"} en commun
      </div>
    </div>
  );
};

const AlterodoWrapper = ({
  alterodos,
  classes,
  resetQuestioning,
  isAsakai
}) => {
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

  if (alterodos.baseQuestionCount === 0)
    return (
      <div>
        Ton alterodo n'est pas défini car tu n'as répondu à aucune question
        validée
      </div>
    );

  if (!alterodos.alterodo.sameAnswerCount)
    return (
      <div>
        Ton alterodo n'est pas défini car personne n'a répondu aux questions
        auxquelles tu as répondu
      </div>
    );

  return (
    <div>
      <Alterodo
        classes={classes}
        alterodo={alterodo}
        isAlterodo={isAlterodoDisplayed}
        baseQuestionCount={alterodos.baseQuestionCount}
        isAsakai={isAsakai}
      />
      <div className={classes.actionsContainer}>
        <div>
          <MaterialButton
            variant="contained"
            size="small"
            fullWidth={false}
            color="secondary"
            onClick={changeAlterodo}
          >
            Et ton {getAlterodoName(!isAlterodoDisplayed)} ?
          </MaterialButton>
        </div>
        <div>
          <MaterialButton
            className={classes.newQuestioning}
            size="small"
            color="secondary"
            onClick={resetQuestioning}
          >
            Retourner aux questions
          </MaterialButton>
        </div>
      </div>
    </div>
  );
};

export default withStyles(style)(AlterodoWrapper);
