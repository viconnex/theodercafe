import React, { useEffect, useState } from 'react';
import { Question } from 'components/Question';
import { fetchRequest } from 'utils/helpers';
import { ALL_QUESTIONS_OPTION, FILTER_OPTIONS, NOT_ANSWERED } from 'utils/constants/questionConstants';
import {
  USER_TO_QUESTIONS_CHOICES_URI,
  API_BASE_URL,
  GOOGLE_AUTH_URI,
  USER_TO_QUESTIONS_VOTES_URI,
} from 'utils/constants/apiConstants';
import { useSnackbar } from 'notistack';
import { withStyles } from '@material-ui/styles';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import ArrowForward from '@material-ui/icons/ArrowForward';
import { isUser } from 'services/jwtDecode';

import style from './style';
import Voter from './Voter';
import { LoginDialog } from 'components/Login';
import { fetchRequestResponse } from 'services/api';

const initialIndexes = {};
FILTER_OPTIONS.forEach(option => {
  initialIndexes[option.value] = 0;
});

const AllQuestioning = ({ classes, filterOption, questions }) => {
  const [questionIndexByStatus, setQuestionIndexByStatus] = useState(initialIndexes);
  const [choices, setChoices] = useState({});
  const [votes, setVotes] = useState({});
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [areChoicesFetched, setAreChoicesFetched] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const fetchChoices = async () => {
    if (!localStorage.jwt_token) return;
    const response = await fetchRequestResponse({ uri: `/${USER_TO_QUESTIONS_CHOICES_URI}/user`, method: 'GET' }, 200, {
      enqueueSnackbar,
    });
    if (!response) {
      return;
    }
    const userChoices = await response.json();
    const choicesDic = {};
    userChoices.forEach(choice => {
      choicesDic[choice.questionId] = choice.choice;
    });
    setChoices(choicesDic);
    setAreChoicesFetched(true);
  };
  const fetchVotes = async () => {
    if (!localStorage.jwt_token) return;
    const response = await fetchRequestResponse({ uri: `/${USER_TO_QUESTIONS_VOTES_URI}/user`, method: 'GET' }, 200, {
      enqueueSnackbar,
    });
    if (!response) {
      return;
    }
    const userVotes = await response.json();
    const votesDic = {};
    userVotes.forEach(vote => {
      votesDic[vote.questionId] = vote.isUpVote;
    });
    setVotes(votesDic);
  };
  useEffect(() => {
    fetchChoices();
    fetchVotes();
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
    if (filterOption !== NOT_ANSWERED) {
      changeQuestion(1);
    } else if (questionIndexByStatus[filterOption] === filteredQuestions.length - 1) {
      changeQuestion(-1);
    }
    if (choices[questionId] !== choice) {
      const url = `/${USER_TO_QUESTIONS_CHOICES_URI}/${questionId}/choice`;
      const body = { choice };
      let response;
      try {
        response = await fetchRequest(url, 'PUT', body);
      } catch {
        return enqueueSnackbar("Ton choix n'a pas pu être enregistré", { variant: 'error' });
      }
      if (response.status !== 200) {
        return enqueueSnackbar("Ton choix n'a pas pu être enregistré", { variant: 'error' });
      }
      enqueueSnackbar('Choix enregistré', { variant: 'success' });
      const newChoices = { ...choices };
      newChoices[questionId] = choice;
      setChoices(newChoices);
    }
  };
  const vote = async (questionId, isUpVote) => {
    if (!isUser()) {
      return setOpenLoginDialog(true);
    }
    const newVote = { ...votes };
    const uri = `/${USER_TO_QUESTIONS_VOTES_URI}/${questionId}/vote`;
    let method = 'PUT';
    let body;

    if (votes.hasOwnProperty(questionId) && votes[questionId] === isUpVote) {
      Reflect.deleteProperty(newVote, questionId);
      method = 'DELETE';
    } else {
      newVote[questionId] = isUpVote;
      body = { isUpVote };
    }
    setVotes(newVote);

    return fetchRequestResponse({ uri, method, body }, 200, { enqueueSnackbar });
  };
  return (
    <React.Fragment>
      <div className={`${classes.questioningContent} ${classes.allQuestioningContent}`}>
        {question && (
          <React.Fragment>
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
            <Voter questionId={question.id} isUpVote={votes[question.id]} vote={vote} />
          </React.Fragment>
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
    </React.Fragment>
  );
};

export default withStyles(style)(AllQuestioning);
