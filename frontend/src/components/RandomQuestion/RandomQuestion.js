import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import ArrowIcon from '@material-ui/icons/ArrowRightAlt';
import { API_BASE_URL } from 'utils/constants';
import { AddQuestionDialog } from 'components/AddQuestionDialog';
import { IconButton } from '@material-ui/core';
import style from './style';
import { Question } from 'components/Question';

class RandomQuestion extends Component {
  componentDidMount = async () => {
    const response = await fetch(API_BASE_URL + 'questions');
    if (response.status === 500) {
      this.setState({ fetchError: true });
      return;
    }
    const data = await response.json();
    this.setState({ questions: data });
  };

  state = {
    addQuestionDialog: false,
    fetchError: false,
    questions: [],
    questionIndex: 0,
  };

  nextQuestion = () => {
    let index = this.state.questionIndex + 1;
    if (index >= this.state.questions.length) index = 0;
    this.setState({ questionIndex: index });
  };

  addQuestion = (option1, option2, categoryName) => {
    this.state.questions.push({ option1, option2, categoryName });
  };

  openModal = () => this.setState({ addQuestionDialog: true });
  closeModal = () => this.setState({ addQuestionDialog: false });

  render() {
    const { classes } = this.props;
    if (this.state.questions.length === 0 && this.state.fetchError) {
      return 'erreur inattendue';
    }

    const question = this.state.questions[this.state.questionIndex];
    return (
      <div>
        {question ? (
          <div>
            <Question question={question} />
            <IconButton classes={{ root: classes.nextButton }} onClick={this.nextQuestion}>
              <ArrowIcon />
            </IconButton>
          </div>
        ) : null}
        <Fab className={classes.addButton} size="small">
          <AddIcon onClick={this.openModal} />
        </Fab>
        <AddQuestionDialog
          className={classes.modal}
          open={this.state.addQuestionDialog}
          onClose={this.closeModal}
          addQuestion={this.addQuestion}
        />
      </div>
    );
  }
}

export default withStyles(style)(RandomQuestion);
