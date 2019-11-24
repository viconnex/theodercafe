import React, { useState } from 'react';
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import { AddQuestionDialog } from 'components/AddQuestionDialog';
import { ModeSelector } from 'components/ModeSelector';

import style from './style';
import AsakaiQuestioning from 'components/Questioning/AsakaiQuestioning';
import AllQuestioning from 'components/Questioning/AllQuestioning';
import { ALL_QUESTIONS_OPTION } from 'utils/constants/questionConstants';

const Home = ({ classes }) => {
  const [addQuestionDialog, setAddQuestionDialog] = useState(false);
  const [isAsakaiMode, setIsAsakaiMode] = useState(true);
  const [validationStatus, setValidationStatus] = useState(ALL_QUESTIONS_OPTION);

  const handleModeChange = isAsakaiMode => {
    setIsAsakaiMode(isAsakaiMode);
  };

  const handleValidationStatusChange = validationStatus => setValidationStatus(validationStatus);

  const toggleModal = open => () => setAddQuestionDialog(open);

  return (
    <div className={classes.pageContainer}>
      <div>
        <ModeSelector
          isAsakaiMode={isAsakaiMode}
          handleModeChange={handleModeChange}
          validationStatus={validationStatus}
          handleValidationStatusChange={handleValidationStatusChange}
        />
        {isAsakaiMode ? <AsakaiQuestioning /> : <AllQuestioning validationStatus={validationStatus} />}
        <Fab className={classes.addButton} size="small">
          <AddIcon onClick={toggleModal(true)} />
        </Fab>
        <AddQuestionDialog
          className={classes.modal}
          open={addQuestionDialog}
          onClose={toggleModal(false)}
          handleQuestionAdded={() => setAddQuestionDialog(false)}
        />
      </div>
    </div>
  );
};

export default withSnackbar(withStyles(style)(Home));
