import React, { Component } from 'react';
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import { AddQuestionDialog } from 'components/AddQuestionDialog';
import { ModeSelector } from 'components/ModeSelector';
import { LoginDialog } from 'components/Login';

import style from './style';
import AsakaiQuestioning from './AsakaiQuestioning';
import AllQuestioning from './AllQuestioning';
import { ALL_QUESTIONS_OPTION } from 'utils/constants';

class Questioning extends Component {
  state = {
    addQuestionDialog: false,
    isAsakaiMode: true,
    validationStatus: ALL_QUESTIONS_OPTION,
  };

  handleModeChange = isAsakaiMode => {
    this.setState({ isAsakaiMode, isAsakaiResult: false });
  };

  handleValidationStatusChange = validationStatus => this.setState({ validationStatus });

  toggleModal = open => () => this.setState({ addQuestionDialog: open });

  render() {
    const { classes } = this.props;
    const isAsakaiMode = this.state.isAsakaiMode;
    return (
      <div className={classes.pageContainer}>
        <div>
          <ModeSelector
            isAsakaiMode={isAsakaiMode}
            handleModeChange={this.handleModeChange}
            handleValidationStatusChange={this.handleValidationStatusChange}
          />
          {isAsakaiMode ? <AsakaiQuestioning /> : <AllQuestioning validationStatus={this.state.validationStatus} />}
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

export default withSnackbar(withStyles(style)(Questioning));
