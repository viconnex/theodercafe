import React, { useEffect, useState } from 'react';
import { Question } from 'components/Question';
import { fetchRequest } from 'utils/helpers';
import {
  ALL_QUESTIONS_MODE,
  ALL_QUESTIONS_OPTION,
  FILTER_OPTIONS,
  NOT_ANSWERED,
} from 'utils/constants/questionConstants';
import { USER_TO_QUESTIONS_URI, API_BASE_URL, GOOGLE_AUTH_URI } from 'utils/constants/apiConstants';
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
FILTER_OPTIONS.forEach(option => {
  initialIndexes[option.value] = 0;
});

const AllQuestioning = ({ classes, filterOption }) => {
  const [questions, setQuestions] = useState([]);
  const [questionIndexByStatus, setQuestionIndexByStatus] = useState(initialIndexes);
  const [choices, setChoices] = useState({});
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [areChoicesFetched, setAreChoicesFetched] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    const fetchQuestions = async () => {
      let response;
      try {
        response = await fetchRequest(`/questions/${ALL_QUESTIONS_MODE}`, 'GET');
      } catch {
        return enqueueSnackbar('Problème de connexion', { variant: 'error' });
      }
      if (response.state === 500) {
        return enqueueSnackbar('Un problème est survenu', { variant: 'error' });
      }
      const data = await response.json();
      setQuestions(data);
    };
    const fetchChoices = async () => {
      if (!localStorage.jwt_token) return;
      const response = await fetchRequest(`/${USER_TO_QUESTIONS_URI}/user`, 'GET');
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
      setAreChoicesFetched(true);
    };
    fetchChoices();
    fetchQuestions();
    // eslint-disable-next-line
  }, []);

  const getValidationInformation = questionValidation => {
    if (questionValidation === null) return 'Question en attente de validation';
    return questionValidation ? 'Question validée' : 'Question invalidée';
  };

  const isNotAnsweredQuestion = question => {
    return areChoicesFetched ? !choices[question.id] : false;
  };
  const isStatus = filterOption => question => {
    const status = FILTER_OPTIONS.find(option => option.value === filterOption);
    return question.isValidated === status.isValidated;
  };

  const getFilteredQuestions = () => {
    if (filterOption === ALL_QUESTIONS_OPTION) return questions;
    if (filterOption === NOT_ANSWERED) return questions.filter(isNotAnsweredQuestion);

    return questions.filter(isStatus(filterOption));
  };

  const filteredQuestions = getFilteredQuestions();
  let questionIndex = questionIndexByStatus[filterOption];

  const question = filteredQuestions[questionIndex];

  const changeQuestion = increment => {
    const questionIndex = questionIndexByStatus[filterOption];
    let index = questionIndex + increment;
    if (index < 0 || index === filteredQuestions.length) index = 0;
    const newQuestionIndex = { ...questionIndexByStatus };
    newQuestionIndex[filterOption] = index;
    setQuestionIndexByStatus(newQuestionIndex);
  };

  const chose = async (questionId, choice) => {
    if (!isUser()) {
      return setOpenLoginDialog(true);
    }
    if (choices[questionId] !== choice) {
      const url = `/${USER_TO_QUESTIONS_URI}/${questionId}/choice`;
      const body = { choice };
      let response;
      try {
        response = await fetchRequest(url, 'PUT', body);
      } catch {
        return enqueueSnackbar("Votre choix n'a pas pu être enregistré", { variant: 'error' });
      }
      if (response.status !== 200) {
        return enqueueSnackbar("Votre choix n'a pas pu être enregistré", { variant: 'error' });
      }
      enqueueSnackbar('Choix enregistré', { variant: 'success' });
      const newChoices = { ...choices };
      newChoices[questionId] = choice;
      setChoices(newChoices);
    }
    if (filterOption !== NOT_ANSWERED) {
      changeQuestion(1);
    } else if (questionIndexByStatus[filterOption] === filteredQuestions.length - 1) {
      changeQuestion(-1);
    }
  };
  return (
    <div>
      <div className={`${classes.questioningContent} ${classes.allQuestioningContent}`}>
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
            <div className={classes.filterOption}>{getValidationInformation(question.isValidated)}</div>
            <Voter questionId={question.id} hasVoted={false} />
          </div>
        )}
        {!question && filterOption === NOT_ANSWERED && areChoicesFetched && (
          <div>Tu as répondu à toutes les questions</div>
        )}
        {!question && filterOption === NOT_ANSWERED && !areChoicesFetched && !localStorage.jwt_token && (
          <div>
            Tu dois{' '}
            <span className={classes.connect} onClick={() => (window.location = API_BASE_URL + GOOGLE_AUTH_URI)}>
              te connecter
            </span>{' '}
            pour voir les questions auxquelles tu n'as pas répondu
          </div>
        )}
      </div>
      <LoginDialog isOpen={openLoginDialog} handleClose={() => setOpenLoginDialog(false)} />
    </div>
  );
};

export default withStyles(style)(AllQuestioning);
