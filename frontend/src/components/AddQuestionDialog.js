import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withSnackbar } from 'notistack';
import { API_BASE_URL } from '../utils/constants';

const style = {
  dialog: {
    padding: '30px',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  dialogTitle: {
    padding: '16px 5px',
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
  const response = await fetch(API_BASE_URL + 'questions', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ option1, option2 }),
  });

  return response;
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
      const response = await postQuestion(this.state.option1, this.state.option2);
      if (response.status !== 201) {
        this.props.enqueueSnackbar("La question n'a pas pu être créée", { variant: 'error' });
      } else {
        this.props.enqueueSnackbar('Question créée !', { variant: 'success' });
      }
    }
  };

  render() {
    const { classes, onClose, open } = this.props;
    return (
      <Dialog fullWidth maxWidth="sm" onClose={onClose} open={open}>
        <div className={classes.dialog}>
          <DialogTitle className={classes.dialogTitle}>Une question ?</DialogTitle>
          <form onSubmit={this.handleSubmit}>
            <TextField
              id="option1"
              fullWidth
              label="thé"
              onChange={this.handleOption1Change}
              value={this.state.option1}
            />
            <p className={classes.separatOR}>ou</p>
            <TextField
              className={classes.option2}
              id="option2"
              fullWidth
              label="café"
              onChange={this.handleOption2Change}
              value={this.state.option2}
            />
            <Button type="submit">Créer une question</Button>
          </form>
        </div>
      </Dialog>
    );
  }
}

export default withSnackbar(withStyles(style)(AddQuestionDialog));
