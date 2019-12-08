import React, { useEffect, useState } from 'react';
import { Question } from 'components/Question';
import { fetchRequest } from 'utils/helpers';
import { ASAKAI_MODE, ASAKAI_QUESTION_COUNT } from 'utils/constants/questionConstants';
import { useSnackbar } from 'notistack';
import { withStyles } from '@material-ui/styles';
import style from './style';
import { Alterodo } from 'components/Alterodo';

const AsakaiQuestioning = ({ classes }) => {
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [asakaiChoices, setAsakaiChoices] = useState({});
  const [alterodo, setAlterodo] = useState(null);

  const { enqueueSnackbar } = useSnackbar();

  const fetchAndSetQuestions = async newSet => {
    let response;
    try {
      response = await fetchRequest(
        `/questions/${ASAKAI_MODE}?maxNumber=${ASAKAI_QUESTION_COUNT}${newSet ? '&newSet=true' : ''}`,
        'GET',
      );
    } catch {
      return enqueueSnackbar('Problème de connexion', { variant: 'error' });
    }
    if (response.state === 500) {
      enqueueSnackbar('Un problème est survenu', { variant: 'error' });
    }
    const data = await response.json();
    setQuestions(data);
    setQuestionIndex(0);
  };

  useEffect(() => {
    fetchAndSetQuestions(false);
    // eslint-disable-next-line
  }, []);

  const resetQuestioning = () => {
    setAlterodo(null);
    setQuestionIndex(0);
  };

  const changeAsakaiSet = () => {
    resetQuestioning();
    fetchAndSetQuestions(true);
  };

  const changeQuestion = increment => {
    let index = questionIndex + increment;
    if (index < 0) index = 0;
    if (index < questions.length && index >= 0) {
      setQuestionIndex(index);
    }
  };

  const handleAsakaiFinish = async () => {
    let response;
    try {
      response = await fetchRequest('/user_to_question_choices/asakai', 'POST', asakaiChoices);
    } catch {
      return enqueueSnackbar('Problème de connexion', { variant: 'error' });
    }
    if (response.status !== 201) {
      return enqueueSnackbar("Une erreur s'est produite", { variant: 'error' });
    }
    const data = await response.json();
    setAlterodo(data);
  };

  const chose = async (questionId, choice) => {
    const choices = asakaiChoices;
    choices[questionId] = choice;
    setAsakaiChoices(choices);
    if (questionIndex === questions.length - 1) {
      handleAsakaiFinish();
    }
    changeQuestion(1);
  };
  const question = questions[questionIndex];
  return (
    <div className={classes.questioningContainer}>
      <div className={classes.asakaiSubtitle}>
        <div>Le set du jour</div>
        <div className={classes.asakaiNewSetButton} onClick={changeAsakaiSet}>
          Changer le set du jour
        </div>
      </div>
      <div className={classes.questioningContent}>
        {question && !alterodo && (
          <div>
            <Question question={question} chose={chose} plusOneEnabled />
            <div className={classes.browser}>
              <div className={classes.counter}>{`${questionIndex + 1} / ${questions.length}`}</div>
            </div>
          </div>
        )}
        {alterodo && <Alterodo alterodo={alterodo} resetQuestioning={resetQuestioning} />}
      </div>
    </div>
  );
};

export default withStyles(style)(AsakaiQuestioning);
