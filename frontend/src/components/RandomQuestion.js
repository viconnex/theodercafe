import React, { Component } from 'react';
import { API_BASE_URL } from '../utils/constants';

const DEFAULT_QUERY = 'questions';

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
    if (this.state.questions.length === 0) return null;

    return (
      <div>
        <p>{`${this.state.questions[this.state.questionIndex].option1} ou ${this.state.questions[this.state.questionIndex].option2} ?`}</p>
        <button onClick={this.changeQuestion}>Suivant</button>
      </div>
    );
  }
}

export default RandomQuestion;
