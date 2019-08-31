import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Fab from '@material-ui/core/Fab';
import ArrowForward from '@material-ui/icons/ArrowForward';
import AddIcon from '@material-ui/icons/Add';
import { API_BASE_URL } from 'utils/constants';
import { AddQuestionDialog } from 'components/AddQuestionDialog';
import { IconButton, MenuItem } from '@material-ui/core';
import { Question } from 'components/Question';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Select from '@material-ui/core/Select';

import style from './style';

const asakaiQuestionNumber = 10;

const ASAKAI_MODE = 'asakai';
const ALL_QUESTIONS_MODE = 'all';

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

  toggleModal = open => () => this.setState({ addQuestionDialog: open });

  handleSwitch = event => {
    const mode = event.target.checked ? ASAKAI_MODE : ALL_QUESTIONS_MODE;
    this.setState({ mode });
    this.fetchQuestions(mode);
  };

  handleValidationStatusChange = event => {
    this.setState({ validationStatusSelected: event.target.value });
  };

  render() {
    const { classes } = this.props;
    if (this.state.questions.length === 0 && this.state.fetchError) {
      return 'erreur inattendue';
    }

    const question = this.state.questions[this.state.questionsIndex];
    return (
      <div className={classes.pageContainer}>
        <div className={classes.modeSelectorContainer}>
          <FormControlLabel
            control={
              <Switch
                color="default"
                classes={{ checked: classes.switchChecked, track: classes.switchTrack }}
                checked={this.state.mode === ASAKAI_MODE}
                onChange={this.handleSwitch}
                value="asakai"
              />
            }
            label="Asakai"
          />
          {this.state.mode === ASAKAI_MODE ? (
            <div className={classes.modeSelectorInfo}>{`Set de ${asakaiQuestionNumber} questions validées`}</div>
          ) : (
            <Select
              className={classes.validationStatusSelect}
              inputProps={{
                classes: {
                  icon: classes.validationStatusSelectIcon,
                },
              }}
              value={this.state.validationStatusSelected}
              onChange={this.handleValidationStatusChange}
            >
              <MenuItem value="all">Toutes les questions</MenuItem>
              <MenuItem value="validated">Validées</MenuItem>
              <MenuItem value="inValidation">En attente de validation</MenuItem>
              <MenuItem value="notValidated">Invalidée</MenuItem>
            </Select>
          )}
        </div>
        <div>
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
                {this.state.mode === ASAKAI_MODE && (
                  <div className={classes.counter}>
                    {`${this.state.questionsIndex + 1} / ${this.state.questions.length}`}
                  </div>
                )}
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
