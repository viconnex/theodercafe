import React, { useEffect, useState } from 'react';

import { Question } from 'components/Question';
import { fetchRequest } from 'utils/helpers';
import { ALL_QUESTIONS_MODE, ALL_QUESTIONS_OPTION, VALIDATION_STATUS_OPTIONS } from 'utils/constants/questionConstants';
import { useSnackbar } from 'notistack';
import { withStyles } from '@material-ui/styles';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import ArrowForward from '@material-ui/icons/ArrowForward';
import { isUser } from 'services/jwtDecode';

import style from './style';
import Voter from './Voter';
import { LoginDialog } from 'components/Login';

const initialIndexes = {};
VALIDATION_STATUS_OPTIONS.forEach(option => {
  initialIndexes[option.value] = 0;
});

const AllQuestioning = ({ classes, validationStatus }) => {
  const [questions, setQuestions] = useState([]);
  const [questionIndexByStatus, setQuestionIndexByStatus] = useState(initialIndexes);
  const [choices, setChoices] = useState({});
  const [openLoginDialog, setOpenLoginDialog] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await fetchRequest(`/questions/${ALL_QUESTIONS_MODE}`, 'GET');
      if (response.state === 500) {
        return enqueueSnackbar('Un problème est survenu', { variant: 'error' });
      }
      const data = await response.json();
      setQuestions(data);
    };
    const fetchChoices = async () => {
      if (!localStorage.jwt_token) return;
      const response = await fetchRequest('/users/choices', 'GET');
      if (response.status === 400)
        return enqueueSnackbar('Un problème est survenu, essaie de te reconnecter', {
          variant: 'error',
          autoHideDuration: 5000,
        });
      if (response.status === 500) return enqueueSnackbar('Un problème est survenu', { variant: 'error' });

      const userChoices = await response.json();
      const choicesDic = {};
      userChoices.forEach(choice => {
        choicesDic[choice.questionId] = choice.choice;
      });
      setChoices(choicesDic);
    };

    fetchQuestions();
    fetchChoices();
  }, []);

  const getValidationInformation = questionValidation => {
    if (questionValidation === null) return 'Question en attente de validation';
    return questionValidation ? 'Question validée' : 'Question en attente de validation';
  };

  const chose = async (questionId, choice) => {
    if (!isUser()) {
      setOpenLoginDialog(true);
    }
    if (choices[questionId] !== choice) {
      const url = `/questions/${questionId}/choice`;
      const body = { choice };
      const response = await fetchRequest(url, 'PUT', body);
      if (response.status !== 200) {
        return enqueueSnackbar("Votre choix n'a pas pu être enregistré", { variant: 'error' });
      }
      enqueueSnackbar('Choix enregistré', { variant: 'success' });
      const newChoices = { ...choices };
      newChoices[questionId] = choice;
      setChoices(newChoices);
    }
  };

  const getFilteredQuestions = () => {
    if (validationStatus === ALL_QUESTIONS_OPTION) return questions;
    return questions.filter(question => {
      const status = VALIDATION_STATUS_OPTIONS.find(option => option.value === validationStatus);
      return question.isValidated === status.isValidated;
    });
  };

  const filteredQuestions = getFilteredQuestions();
  const questionIndex = questionIndexByStatus[validationStatus];
  const question = filteredQuestions[questionIndex];

  const changeQuestion = increment => {
    const questionIndex = questionIndexByStatus[validationStatus];
    let index = questionIndex + increment;
    if (index < 0 || index === filteredQuestions.length) index = 0;
    const newQuestionIndex = { ...questionIndexByStatus };
    newQuestionIndex[validationStatus] = index;
    setQuestionIndexByStatus(newQuestionIndex);
  };
  return (
    <div>
      {question && (
        <div>
          <Question question={question} chose={chose} choice={choices[question.id]} />
          <div className={classes.browser}>
            <IconButton
              disabled={questionIndex === 0}
              classes={{ root: classes.nextButton }}
              onClick={() => changeQuestion(-1)}
            >
              <ArrowBack />
            </IconButton>
            <IconButton classes={{ root: classes.nextButton }} onClick={() => changeQuestion(1)}>
              <ArrowForward />
            </IconButton>
            <div className={classes.counter}>{`${questionIndex + 1} / ${filteredQuestions.length}`}</div>
          </div>
          <div className={classes.validationStatus}>{getValidationInformation(question.isValidated)}</div>
          <Voter questionId={question.id} hasVoted={false} />
        </div>
      )}
      <LoginDialog isOpen={openLoginDialog} handleClose={() => setOpenLoginDialog(false)} />
    </div>
  );
};

export default withStyles(style)(AllQuestioning);
