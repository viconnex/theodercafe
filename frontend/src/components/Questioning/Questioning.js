import React, { Component } from 'react';
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Fab from '@material-ui/core/Fab';
import ArrowForward from '@material-ui/icons/ArrowForward';
import ThumbUp from '@material-ui/icons/ThumbUp';
import ThumbDown from '@material-ui/icons/ThumbDown';
import AddIcon from '@material-ui/icons/Add';
import { API_BASE_URL } from 'utils/constants';
import { AddQuestionDialog } from 'components/AddQuestionDialog';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { Question } from 'components/Question';
import { ASAKAI_MODE } from 'utils/constants';

import style from './style';
import { ModeSelector } from 'components/ModeSelector';
import { fetchRequest } from 'utils/helpers';

const asakaiQuestionNumber = 10;

const isValidated = {
  validated: true,
  notValidated: false,
  inValidation: null,
};

const getValidationInformation = validationStatus => {
  if (validationStatus) {
    return 'Question validée';
  }
  if (validationStatus === false) {
    return 'Question invalidée';
  }
  return 'Question en attente de validation';
};

class Questioning extends Component {
  componentDidMount = () => {
    this.fetchQuestions(this.state.mode);
  };

  state = {
    addQuestionDialog: false,
    fetchError: false,
    filteredQuestions: [],
    mode: ASAKAI_MODE,
    questions: [],
    questionsIndex: 0,
    validationStatusSelected: 'all',
    hasVotedQuestions: new Set(),
  };

  fetchQuestions = async mode => {
    const queryParam = mode === ASAKAI_MODE ? `?maxNumber=${asakaiQuestionNumber}` : '';
    const response = await fetch(API_BASE_URL + '/questions/' + mode + queryParam);
    if (response.status === 500) {
      this.setState({ fetchError: true });
      return;
    }
    const data = await response.json();
    this.setState({
      questions: data,
      questionsIndex: 0,
      filteredQuestions: this.getFilteredQuestions(data, this.state.validationStatusSelected),
    });
  };

  changeQuestion = increment => () => {
    let index = this.state.questionsIndex + increment;
    if (index >= this.state.filteredQuestions.length || index < 0) index = 0;
    this.setState({ questionsIndex: index });
  };

  addQuestion = (option1, option2, categoryName) => {
    if (this.state.mode !== ASAKAI_MODE) {
      this.state.questions.push({ option1, option2, categoryName });
    }
  };
  handleModeChange = mode => {
    this.fetchQuestions(mode);
    this.setState({ mode });
  };
  handleValidationStatusChange = validationStatusSelected => {
    this.setState({
      filteredQuestions: this.getFilteredQuestions(this.state.questions, validationStatusSelected),
      validationStatusSelected: validationStatusSelected,
      questionsIndex: 0,
    });
  };

  toggleModal = open => () => this.setState({ addQuestionDialog: open });

  getFilteredQuestions = (questions, validationStatusSelected) => {
    if (this.state.mode === ASAKAI_MODE || validationStatusSelected === 'all') return questions;

    return questions.filter(question => question.isValidated === isValidated[validationStatusSelected]);
  };

  handleUpVote = (isUpVote, questionId) => async () => {
    if (this.state.hasVotedQuestions.has(questionId)) {
      return this.props.enqueueSnackbar('Tu as déjà voté pour cette question', { variant: 'error' });
    }
    this.state.hasVotedQuestions.add(questionId);

    const url = API_BASE_URL + `/questions/${questionId}/upVote`;
    const body = { isUpVote };
    const response = await fetchRequest(url, 'PUT', body);
    if (response.status === 200) {
      this.props.enqueueSnackbar('Merci pour ton avis sur cette question', { variant: 'success' });
    }
  };

  render() {
    const { classes } = this.props;
    if (this.state.questions.length === 0 && this.state.fetchError) {
      return 'erreur inattendue';
    }

    const question = this.state.filteredQuestions[this.state.questionsIndex];
    const hasVoted = question ? this.state.hasVotedQuestions.has(question.id) : false;
    return (
      <div className={classes.pageContainer}>
        <div>
          <ModeSelector
            questionNumber={asakaiQuestionNumber}
            handleModeChange={this.handleModeChange}
            handleValidationStatusChange={this.handleValidationStatusChange}
          />
          {question ? (
            <div>
              <Question question={question} />
              <div className={classes.browser}>
                <IconButton
                  disabled={this.state.questionsIndex === 0}
                  classes={{ root: classes.nextButton }}
                  onClick={this.changeQuestion(-1)}
                >
                  <ArrowBack />
                </IconButton>
                <IconButton classes={{ root: classes.nextButton }} onClick={this.changeQuestion(1)}>
                  <ArrowForward />
                </IconButton>
                <div className={classes.counter}>
                  {`${this.state.questionsIndex + 1} / ${this.state.filteredQuestions.length}`}
                </div>
              </div>
              {this.state.mode !== ASAKAI_MODE && (
                <div className={classes.validationStatus}>{getValidationInformation(question.isValidated)}</div>
              )}
              <div className={classes.upVote}>
                <Tooltip title="Je n'aime pas cette question">
                  <IconButton color="primary" onClick={this.handleUpVote(false, question.id)} disabled={hasVoted}>
                    <ThumbDown />
                  </IconButton>
                </Tooltip>
                <Tooltip title="J'aime cette question">
                  <IconButton color="primary" onClick={this.handleUpVote(true, question.id)} disabled={hasVoted}>
                    <ThumbUp />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          ) : null}
          <Fab className={classes.addButton} size="small">
            <AddIcon onClick={this.toggleModal(true)} />
          </Fab>
          <AddQuestionDialog
            className={classes.modal}
            open={this.state.addQuestionDialog}
            onClose={this.toggleModal(false)}
            addQuestion={this.addQuestion}
          />
        </div>
      </div>
    );
  }
}

export default withSnackbar(withStyles(style)(Questioning));
