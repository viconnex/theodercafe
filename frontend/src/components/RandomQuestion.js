import React, { Component } from 'react';
import config from '../utils/config.json';

const DEFAULT_QUERY = 'questions';

class RandomQuestion extends Component {
  state = {
    questions: []
  };

  componentDidMount() {
    fetch(config[process.env.NODE_ENV].BACKEND_URL + DEFAULT_QUERY)
      .then(response => response.json())
      .then(data => this.setState({ questions: data }));
  }

  render() {
    return this.state.questions.length > 0
    ? <p>{`${this.state.questions[0].option1} ou ${this.state.questions[0].option2} ?`}</p>
    :  <p>Pas de question</p>
  }
}

export default RandomQuestion;
