import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { API_BASE_URL } from '../utils/constants';

const style = {
  dialog: {
    padding: '30px',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  separatOR: {
    textAlign: 'center',
    marginBottom: 0,
  },
  option2: {
    marginBottom: '20px',
  },
};

const postQuestion = async (option1, option2) => {
  await fetch(API_BASE_URL + 'questions', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ option1, option2 }),
  });
};

class AddQuestionDialog extends Component {
  state = {
    option1: '',
    option2: '',
  };

  handleOption1Change = event => {
    this.setState({ option1: event.target.value });
  };

  handleOption2Change = event => {
    this.setState({ option2: event.target.value });
  };

  handleSubmit = async event => {
    event.preventDefault();
    if (this.state.option1 !== '' && this.state.option2 !== '') {
      postQuestion(this.state.option1, this.state.option2);
    }
  };

  render() {
    const { classes, onClose, open } = this.props;
    return (
      <Dialog fullWidth maxWidth="sm" onClose={onClose} open={open}>
        <div className={classes.dialog}>
          <DialogTitle>Une question ?</DialogTitle>
          <form onSubmit={this.handleSubmit}>
            <TextField
              id="option1"
              fullWidth
              value={this.state.option1}
              onChange={this.handleOption1Change}
            />
            <p className={classes.separatOR}>ou</p>
            <TextField
              id="option2"
              fullWidth
              className={classes.option2}
              value={this.state.option2}
              onChange={this.handleOption2Change}
            />
            <Button type="submit">Créer une question</Button>
          </form>
        </div>
      </Dialog>
    );
  }
}

export default withStyles(style)(AddQuestionDialog);
