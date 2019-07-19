import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import ArrowIcon from '@material-ui/icons/ArrowRightAlt';
import { API_BASE_URL, QUESTION_QUERY } from 'utils/constants';
import { fetchRequest } from 'utils/helpers';
import { AddQuestionDialog } from 'components/AddQuestionDialog';
import { IconButton } from '@material-ui/core';
import style from './style';
import { PlusOne } from '../PlusOne';

class RandomQuestion extends Component {
  componentDidMount = async () => {
    const response = await fetch(API_BASE_URL + QUESTION_QUERY);
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
    option1VoteTrigger: 0,
    option2VoteTrigger: 0,
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

  voteForOption1 = () => {
    this.setState(state => ({ option1VoteTrigger: state.option1VoteTrigger + 1 }));
    this.vote(1);
  };

  voteForOption2 = () => {
    this.setState(state => ({ option2VoteTrigger: state.option2VoteTrigger + 1 }));
    this.vote(2);
  };

  vote = optionIndex => {
    const questionId = this.state.questions[this.state.questionIndex].id;
    const url = API_BASE_URL + QUESTION_QUERY + `/${questionId}/vote`;
    const body = { optionIndex };

    fetchRequest(url, 'PUT', body);
  };

  render() {
    const { classes } = this.props;
    if (this.state.questions.length === 0 && this.state.fetchError) {
      return 'erreur inattendue';
    }

    const question = this.state.questions[this.state.questionIndex];
    return (
      <div>
        {question ? (
          <div className={classes.pageContainer}>
            <div className={classes.categoryContainer}>
              <div className={classes.categoryTitle}>Catégorie</div>
              <div className={classes.categoryContent}>
                {question.categoryName ? question.categoryName : 'hors catégorie'}
              </div>
            </div>
            <div className={classes.questionContainer}>
              <div className={classes.optionContainer}>
                <div onClick={this.voteForOption1} className={classes.questionPart}>
                  <span className={classes.option}>{question.option1}</span>
                </div>
                {this.state.option1VoteTrigger > 0 && (
                  <PlusOne update={this.state.option1VoteTrigger} />
                )}
              </div>
              <div className={classes.questionPart}> ou </div>
              <div className={classes.optionContainer}>
                <div onClick={this.voteForOption2}>
                  <span className={classes.option}>{question.option2}</span>
                  <span> ?</span>
                </div>
                {this.state.option2VoteTrigger > 0 && (
                  <PlusOne update={this.state.option2VoteTrigger} />
                )}
              </div>
            </div>
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
