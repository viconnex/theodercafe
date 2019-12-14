import React, { useState, useEffect } from 'react';
import { withSnackbar, useSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import { AddQuestionDialog } from 'components/AddQuestionDialog';
import { ModeSelector } from 'components/ModeSelector';

import style from './style';
import AsakaiQuestioning from 'components/Questioning/AsakaiQuestioning';
import AllQuestioning from 'components/Questioning/AllQuestioning';
import { VALIDATED_OPTION, ALL_QUESTIONS_MODE } from 'utils/constants/questionConstants';
import { fetchRequestResponse } from 'services/api';

const Home = ({ classes }) => {
  const [questions, setQuestions] = useState([]);
  const [addQuestionDialog, setAddQuestionDialog] = useState(false);
  const [isAsakaiMode, setIsAsakaiMode] = useState(new Date().getDay() === 1);
  const [filterOption, setFilterOption] = useState(VALIDATED_OPTION);

  const { enqueueSnackbar } = useSnackbar();
  const fetchQuestions = async () => {
    const response = await fetchRequestResponse({ uri: `/questions/${ALL_QUESTIONS_MODE}`, method: 'GET' }, 200, {
      enqueueSnackbar,
    });
    if (!response) {
      return;
    }
    const data = await response.json();
    setQuestions(data);
  };

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line
  }, []);

  const handleModeChange = isAsakaiMode => {
    setIsAsakaiMode(isAsakaiMode);
  };

  const handleFilterOptionChange = filterOption => setFilterOption(filterOption);

  const toggleModal = open => () => setAddQuestionDialog(open);

  return (
    <div className={classes.pageContainer}>
      <ModeSelector
        isAsakaiMode={isAsakaiMode}
        handleModeChange={handleModeChange}
        filterOption={filterOption}
        handleFilterOptionChange={handleFilterOptionChange}
      />
      {isAsakaiMode ? <AsakaiQuestioning /> : <AllQuestioning filterOption={filterOption} questions={questions} />}
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
  );
};

export default withSnackbar(withStyles(style)(Home));
