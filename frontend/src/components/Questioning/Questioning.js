import React, { Component } from 'react';
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Fab from '@material-ui/core/Fab';
import ArrowForward from '@material-ui/icons/ArrowForward';
import AddIcon from '@material-ui/icons/Add';
import { AddQuestionDialog } from 'components/AddQuestionDialog';
import IconButton from '@material-ui/core/IconButton';
import { Question } from 'components/Question';
import { ASAKAI_MODE, ALL_QUESTIONS_MODE } from 'utils/constants';

import style from './style';
import { ModeSelector } from 'components/ModeSelector';
import Voter from './Voter';
import { fetchRequest } from 'utils/helpers';
import { LoginDialog } from 'components/Login';
import { isUser } from 'services/jwtDecode';

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
    this.fetchQuestions(this.state.isAsakaiMode);
    this.fetchChoices();
  };

  state = {
    addQuestionDialog: false,
    loginDialog: false,
    fetchError: false,
    filteredQuestions: [],
    isAsakaiMode: true,
    questions: [],
    questionsIndex: 0,
    validationStatusSelected: 'all',
    hasVotedQuestions: new Set(),
    choices: {},
    asakaiChoices: {},
    isAsakaiResult: false,
  };

  fetchQuestions = async isAsakaiMode => {
    const queryParam = isAsakaiMode ? `?maxNumber=${asakaiQuestionNumber}` : '';
    const uri = isAsakaiMode ? ASAKAI_MODE : ALL_QUESTIONS_MODE;
    const response = await fetchRequest('/questions/' + uri + queryParam, 'GET');
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

  fetchChoices = async () => {
    if (!localStorage.jwt_token) return;

    const response = await fetchRequest('/users/choices', 'GET');
    const userChoices = await response.json();
    const choicesDic = {};
    userChoices.forEach(choice => {
      choicesDic[choice.questionId] = choice.choice;
    });
    this.setState({ choices: choicesDic });
  };

  changeQuestion = increment => () => {
    let index = this.state.questionsIndex + increment;
    if (index < 0) index = 0;
    if (index < this.state.filteredQuestions.length && index >= 0) {
      return this.setState({ questionsIndex: index });
    }
    if (this.state.isAsakaiMode === ALL_QUESTIONS_MODE) {
      return this.setState({ questionsIndex: 0 });
    }
    return this.setState({ isAsakaiResult: true });
  };

  addQuestion = (option1, option2, categoryName) => {
    if (!this.state.isAsakaiMode) {
      this.state.questions.push({ option1, option2, categoryName, isValidated: null });
    }
  };
  handleModeChange = isAsakaiMode => {
    this.fetchQuestions(isAsakaiMode);
    this.setState({ isAsakaiMode, isAsakaiResult: false });
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
    if (this.state.isAsakaiMode || validationStatusSelected === 'all') return questions;

    return questions.filter(question => question.isValidated === isValidated[validationStatusSelected]);
  };

  chose = async (questionId, choice) => {
    if (this.state.isAsakaiMode) {
      return this.handleAsakaiChoice(questionId, choice);
    }
    return this.handleUserChoice(questionId, choice);
  };

  handleAsakaiChoice = (questionId, choice) => {
    const choices = this.state.asakaiChoices;
    choices[questionId] = choice;
    this.setState({ asakaiChoices: choices });
    this.changeQuestion(1)();
  };

  handleUserChoice = async (questionId, choice) => {
    if (!isUser()) {
      return this.setState({ loginDialog: true });
    }
    if (this.state.choices[questionId] !== choice) {
      const url = `/questions/${questionId}/choice`;
      const body = { choice };
      const response = await fetchRequest(url, 'PUT', body);
      if (response.status !== 200) {
        return this.props.enqueueSnackbar("Votre choix n'a pas pu être enregistré", { variant: 'error' });
      }
      this.props.enqueueSnackbar('Choix enregistré', { variant: 'success' });
      const newChoices = { ...this.state.choices };
      newChoices[questionId] = choice;
      this.setState({ choices: newChoices });
    }
  };

  render() {
    const { classes } = this.props;
    if (this.state.questions.length === 0 && this.state.fetchError) {
      return 'erreur inattendue';
    }
    const isAsakaiMode = this.state.isAsakaiMode;
    const question = this.state.filteredQuestions[this.state.questionsIndex];
    const hasVoted = question ? this.state.hasVotedQuestions.has(question.id) : false;
    const choice = isAsakaiMode ? null : this.state.choices[question.id];
    return (
      <div className={classes.pageContainer}>
        <div>
          <ModeSelector
            questionNumber={asakaiQuestionNumber}
            handleModeChange={this.handleModeChange}
            handleValidationStatusChange={this.handleValidationStatusChange}
          />
          {question && !this.state.isAsakaiResult && (
            <div>
              <Question question={question} choice={choice} chose={this.chose} />
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
              {!this.state.isAsakaiMode && (
                <div className={classes.validationStatus}>{getValidationInformation(question.isValidated)}</div>
              )}
              <Voter questionId={question.id} hasVoted={hasVoted} />
            </div>
          )}
          {isAsakaiMode && this.state.isAsakaiResult && <div>fin des questions</div>}
          <Fab className={classes.addButton} size="small">
            <AddIcon onClick={this.toggleModal(true)} />
          </Fab>
          <AddQuestionDialog
            className={classes.modal}
            open={this.state.addQuestionDialog}
            onClose={this.toggleModal(false)}
            addQuestion={this.addQuestion}
          />
          <LoginDialog isOpen={this.state.loginDialog} handleClose={() => this.setState({ loginDialog: false })} />
        </div>
      </div>
    );
  }
}

export default withSnackbar(withStyles(style)(Questioning));
