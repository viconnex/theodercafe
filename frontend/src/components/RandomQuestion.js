import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { API_BASE_URL } from '../utils/constants';

const DEFAULT_QUERY = 'questions';

const style = {
  categoryContainer: {
    marginBottom: '35px',
  },
  categoryTitle: {
    fontSize: '18px',
  },
  categoryContent: {
    fontSize: '16px',
    fontStyle: 'italic',
  },
};

class RandomQuestion extends Component {
  componentDidMount() {
    fetch(API_BASE_URL + DEFAULT_QUERY)
      .then(response => response.json())
      .then(data => this.setState({ questions: data }));
  }

  state = {
    questions: [],
    questionIndex: 0,
  };

  getRandomIndex = () => Math.floor(Math.random() * this.state.questions.length);

  changeQuestion = () => {
    this.setState({ questionIndex: this.getRandomIndex() });
  };

  render() {
    const { classes } = this.props;
    if (this.state.questions.length === 0) return null;

    const question = this.state.questions[this.state.questionIndex];
    return (
      <div>
        <div className={classes.categoryContainer}>
          <div className={classes.categoryTitle}>Catégorie</div>
          <p className={classes.categoryContent}>
            {question.category ? question.category.name : 'hors catégorie'}
          </p>
        </div>
        <p>{`${question.option1} ou ${question.option2} ?`}</p>
        <button onClick={this.changeQuestion}>Suivant</button>
      </div>
    );
  }
}

export default withStyles(style)(RandomQuestion);
