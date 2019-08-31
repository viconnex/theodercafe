import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Select from '@material-ui/core/Select';
import style from './style';
import MenuItem from '@material-ui/core/MenuItem';
import { ASAKAI_MODE, ALL_QUESTIONS_MODE } from 'utils/constants';

const ModeSelector = ({ classes, handleModeChange, handleValidationStatusChange, questionNumber }) => {
  const [modeSelected, setMode] = React.useState(ASAKAI_MODE);
  const [validationStatusSelected, setValidationStatus] = React.useState('all');

  const handleSwitch = event => {
    const mode = event.target.checked ? ASAKAI_MODE : ALL_QUESTIONS_MODE;
    setMode(mode);
    handleModeChange(mode);
  };

  return (
    <div className={classes.modeSelectorContainer}>
      <FormControlLabel
        control={
          <Switch
            color="default"
            classes={{ checked: classes.switchChecked, track: classes.switchTrack }}
            checked={modeSelected === ASAKAI_MODE}
            onChange={handleSwitch}
            value="asakai"
          />
        }
        label="Asakai"
      />
      {modeSelected === ASAKAI_MODE ? (
        <div className={classes.modeSelectorInfo}>{`Set de ${questionNumber} questions validées`}</div>
      ) : (
        <Select
          className={classes.validationStatusSelect}
          inputProps={{
            classes: {
              icon: classes.validationStatusSelectIcon,
            },
          }}
          value={validationStatusSelected}
          onChange={event => {
            setValidationStatus(event.target.value);
            handleValidationStatusChange(event.target.value);
          }}
        >
          <MenuItem value="all">Toutes les questions</MenuItem>
          <MenuItem value="validated">Validées</MenuItem>
          <MenuItem value="inValidation">En attente de validation</MenuItem>
          <MenuItem value="notValidated">Invalidée</MenuItem>
        </Select>
      )}
    </div>
  );
};

export default withStyles(style)(ModeSelector);
