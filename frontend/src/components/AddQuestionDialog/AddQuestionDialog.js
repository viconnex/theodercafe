import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Close from '@material-ui/icons/Close';
import Creatable from 'react-select/creatable';
import { withSnackbar } from 'notistack';
import { API_BASE_URL } from 'utils/constants';
import { fetchRequest } from 'utils/helpers';
import style from './style';

const postQuestion = async (option1, option2, category) => {
  const url = API_BASE_URL + '/questions';
  const body = { option1, option2, category };
  const response = await fetchRequest(url, 'POST', body);

  return response;
};

const choisis = (option1, option2) => (Math.floor(Math.random() * 2) === 0 ? option1 : option2);

class AddQuestionDialog extends Component {
  componentDidMount = async () => {
    this.fetchCategories(this.setState);
  };

  fetchCategories = async () => {
    const response = await fetch(API_BASE_URL + '/categories');
    const data = await response.json();
    this.setState({ categories: data });
  };

  state = {
    option1: '',
    option2: '',
    categoryValue: null,
    categoryLabel: null,
    categories: [],
  };

  handleOption1Change = event => {
    this.setState({ option1: event.target.value });
  };

  handleOption2Change = event => {
    this.setState({ option2: event.target.value });
  };

  handleCategoryChange = newValue => {
    this.setState({ categoryValue: newValue.value, categoryLabel: newValue.label });
  };

  handleSubmit = async event => {
    event.preventDefault();
    const response = await postQuestion(this.state.option1, this.state.option2, this.state.categoryValue);
    if (response.status === 201) {
      const ackResponse = choisis(this.state.option1, this.state.option2);
      this.props.enqueueSnackbar(`${ackResponse} !`, { variant: 'success' });
      const categoryName = this.state.categoryValue ? this.state.categoryLabel : null;
      this.props.addQuestion(this.state.option1, this.state.option2, categoryName);
    } else {
      this.props.enqueueSnackbar("La question n'a pas pu être créée", { variant: 'error' });
    }
    this.setState({ option1: '', option2: '', categoryValue: null, categoryLabel: null });
    this.fetchCategories();
  };

  render() {
    const { classes, onClose, open } = this.props;
    const categoryOptions = this.state.categories.map(category => ({
      label: category.name,
      value: category.id,
    }));
    const categorySelectValue = this.state.categoryValue
      ? { label: this.state.categoryLabel, value: this.state.categoryValue }
      : null;

    return (
      <Dialog fullWidth maxWidth="sm" onClose={onClose} open={open} PaperProps={{ className: classes.dialog }}>
        <IconButton onClick={onClose} className={classes.closeButton}>
          <Close />
        </IconButton>
        <DialogTitle className={classes.dialogTitle}>Une question ?</DialogTitle>
        <form className={classes.form} onSubmit={this.handleSubmit}>
          <TextField
            required
            id="option1"
            fullWidth
            label="thé"
            onChange={this.handleOption1Change}
            value={this.state.option1}
          />
          <p className={classes.separatOR}>ou</p>
          <div className={classes.option2Wrapper}>
            <TextField
              required
              className={classes.option2}
              id="option2"
              fullWidth
              label="café"
              onChange={this.handleOption2Change}
              value={this.state.option2}
            />
            <span className={classes.interroBang}>?</span>
          </div>
          <div className={classes.categoryTitle}>Catégorie</div>
          <div className={classes.categorySubTitle}>Choisis une catégorie ou crée-z-en une</div>
          <Creatable
            className={classes.creatable}
            menuPlacement="auto"
            options={categoryOptions}
            onChange={this.handleCategoryChange}
            placeholder="Choisis ou crée..."
            value={categorySelectValue}
          />
          <Button color="primary" type="submit">
            Poser une question
          </Button>
        </form>
      </Dialog>
    );
  }
}

export default withSnackbar(withStyles(style)(AddQuestionDialog));
