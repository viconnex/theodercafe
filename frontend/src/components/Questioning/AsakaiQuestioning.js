import React, { useEffect, useState } from 'react';
import { Question } from 'components/Question';
import { fetchRequest } from 'utils/helpers';
import { ASAKAI_MODE, ASAKAI_QUESTION_COUNT } from 'utils/constants/questionConstants';
import { useSnackbar } from 'notistack';
import { withStyles } from '@material-ui/styles';
import style from './style';

const AsakaiQuestioning = ({ classes }) => {
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [asakaiChoices, setAsakaiChoices] = useState({});

  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    const fetchQuestions = async () => {
      let response;
      try {
        response = await fetchRequest(`/questions/${ASAKAI_MODE}?maxNumber=${ASAKAI_QUESTION_COUNT}`, 'GET');
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
    fetchQuestions();
    // eslint-disable-next-line
  }, []);

  const changeQuestion = increment => {
    let index = questionIndex + increment;
    if (index < 0) index = 0;
    if (index < questions.length && index >= 0) {
      setQuestionIndex(index);
    }
  };

  const handleAsakaiFinish = async () => {
    const response = await fetchRequest('/user_to_question_choices/asakai', 'POST', asakaiChoices);
    console.log(response);
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
    <div>
      {question && (
        <div>
          <Question question={question} chose={chose} plusOneEnabled />
          <div className={classes.browser}>
            <div className={classes.counter}>{`${questionIndex + 1} / ${questions.length}`}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withStyles(style)(AsakaiQuestioning);
