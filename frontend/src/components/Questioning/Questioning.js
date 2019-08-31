import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Fab from '@material-ui/core/Fab';
import ArrowForward from '@material-ui/icons/ArrowForward';
import AddIcon from '@material-ui/icons/Add';
import { API_BASE_URL } from 'utils/constants';
import { AddQuestionDialog } from 'components/AddQuestionDialog';
import { IconButton } from '@material-ui/core';
import { Question } from 'components/Question';
import { ASAKAI_MODE } from 'utils/constants';

import style from './style';
import { ModeSelector } from 'components/ModeSelector';

const asakaiQuestionNumber = 10;

class Questioning extends Component {
  componentDidMount = () => {
    this.fetchQuestions(this.state.mode);
  };

  state = {
    addQuestionDialog: false,
    fetchError: false,
    mode: ASAKAI_MODE,
    questions: [],
    questionsIndex: 0,
    validationStatusSelected: 'all',
  };

  fetchQuestions = async mode => {
    const queryParam = mode === ASAKAI_MODE ? `?maxNumber=${asakaiQuestionNumber}` : '';
    const response = await fetch(API_BASE_URL + '/questions/' + mode + queryParam);
    if (response.status === 500) {
      this.setState({ fetchError: true });
      return;
    }
    const data = await response.json();
    this.setState({ questions: data, questionsIndex: 0 });
  };

  changeQuestion = increment => () => {
    let index = this.state.questionsIndex + increment;
    if (index >= this.state.questions.length || index < 0) index = 0;
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

  toggleModal = open => () => this.setState({ addQuestionDialog: open });

  render() {
    const { classes } = this.props;
    if (this.state.questions.length === 0 && this.state.fetchError) {
      return 'erreur inattendue';
    }

    const question = this.state.questions[this.state.questionsIndex];
    return (
      <div className={classes.pageContainer}>
        <div>
          <ModeSelector questionNumber={asakaiQuestionNumber} handleModeChange={this.handleModeChange} />
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
                  {`${this.state.questionsIndex + 1} / ${this.state.questions.length}`}
                </div>
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

export default withStyles(style)(Questioning);
