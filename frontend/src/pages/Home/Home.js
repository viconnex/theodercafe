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
import { VALIDATED_OPTION } from 'utils/constants/questionConstants';

const Home = ({ classes }) => {
  const [addQuestionDialog, setAddQuestionDialog] = useState(false);
  const [isAsakaiMode, setIsAsakaiMode] = useState(new Date().getDay() === 1);
  const [filterOption, setFilterOption] = useState(VALIDATED_OPTION);

  const handleModeChange = isAsakaiMode => {
    setIsAsakaiMode(isAsakaiMode);
  };

  const handleFilterOptionChange = filterOption => setFilterOption(filterOption);

  const toggleModal = open => () => setAddQuestionDialog(open);

  return (
    <div className={classes.pageContainer}>
      <div>
        <ModeSelector
          isAsakaiMode={isAsakaiMode}
          handleModeChange={handleModeChange}
          filterOption={filterOption}
          handleFilterOptionChange={handleFilterOptionChange}
        />
        {isAsakaiMode ? <AsakaiQuestioning /> : <AllQuestioning filterOption={filterOption} />}
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
