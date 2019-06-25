import React, { Component } from 'react';
import { API_BASE_URL } from '../utils/constants';

const DEFAULT_QUERY = 'questions';

class RandomQuestion extends Component {
  componentDidMount() {
    console.log(API_BASE_URL);
    fetch(API_BASE_URL + DEFAULT_QUERY)
      .then(response => response.json())
      .then(data => this.setState({ questions: data }));
  }

  state = {
    questions: [],
  };
  randomQuestionIndex = () => {};

  render() {
    if (this.state.questions.length === 0) return null;

    const randomQuestionIndex = Math.floor(
      Math.random() * this.state.questions.length,
    );

    return (
      <p>{`${this.state.questions[randomQuestionIndex].option1} ou ${this.state.questions[randomQuestionIndex].option2} ?`}</p>
    );
  }
}

export default RandomQuestion;
