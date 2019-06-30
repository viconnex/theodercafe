import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import ArrowIcon from '@material-ui/icons/ArrowRightAlt';
import { API_BASE_URL } from '../utils/constants';
import AddQuestionDialog from './AddQuestionDialog';
import { IconButton } from '@material-ui/core';
const DEFAULT_QUERY = 'questions';

const style = {
  categoryContainer: {
    marginBottom: '35px',
  },
  categoryTitle: {
    fontSize: '18px',
    marginBottom: '5px',
  },
  categoryContent: {
    fontSize: '16px',
    fontStyle: 'italic',
  },
  questionContainer: {
    fontSize: '18px',
    padding: '5px',
  },
  questionPart: {
    marginBottom: '5px',
  },
  nextButton: {
    color: 'white',
  },
  addButton: {
    position: 'absolute',
    bottom: '30px',
    right: '30px',
  },
  matAddbut: {
    backgroundColor: 'white',
  },
  modal: {
    padding: '30px',
  },
};

class RandomQuestion extends Component {
  componentDidMount() {
    fetch(API_BASE_URL + DEFAULT_QUERY)
      .then(response => response.json())
      .then(data => this.setState({ questions: data }));
  }

  state = {
    addQuestionDialog: false,
    questions: [],
    questionIndex: 0,
  };

  getRandomIndex = () => Math.floor(Math.random() * this.state.questions.length);

  changeQuestion = () => {
    this.setState({ questionIndex: this.getRandomIndex() });
  };

  openModal = () => this.setState({ addQuestionDialog: true });
  closeModal = () => this.setState({ addQuestionDialog: false });

  render() {
    const { classes } = this.props;
    if (this.state.questions.length === 0) return null;

    const question = this.state.questions[this.state.questionIndex];
    return (
      <div>
        <div className={classes.categoryContainer}>
          <div className={classes.categoryTitle}>Catégorie</div>
          <div className={classes.categoryContent}>
            {question.category ? question.category.name : 'hors catégorie'}
          </div>
        </div>
        <div className={classes.questionContainer}>
          <div className={classes.questionPart}>{question.option1}</div>
          <div className={classes.questionPart}> ou </div>
          <div>{`${question.option2} ?`}</div>
        </div>
        <IconButton classes={{ root: classes.nextButton }} onClick={this.changeQuestion}>
          <ArrowIcon />
        </IconButton>
        <Fab className={classes.addButton} size="small">
          <AddIcon onClick={this.openModal} />
        </Fab>
        <AddQuestionDialog
          className={classes.modal}
          open={this.state.addQuestionDialog}
          onClose={this.closeModal}
        />
      </div>
    );
  }
}

export default withStyles(style)(RandomQuestion);
