import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Select from '@material-ui/core/Select';
import style from './style';
import MenuItem from '@material-ui/core/MenuItem';
import { VALIDATION_STATUS_OPTIONS, ASAKAI_QUESTION_COUNT } from 'utils/constants/questionConstants';

const ModeSelector = ({ classes, handleModeChange, handleValidationStatusChange, isAsakaiMode, validationStatus }) => {
  const handleSwitch = event => {
    handleModeChange(!!event.target.checked);
  };

  return (
    <div className={classes.modeSelectorContainer}>
      <FormControlLabel
        control={
          <Switch
            color="default"
            classes={{ checked: classes.switchChecked, track: classes.switchTrack }}
            checked={isAsakaiMode}
            onChange={handleSwitch}
            value="asakai"
          />
        }
        label="Asakai"
      />
      {isAsakaiMode ? (
        <div className={classes.modeSelectorInfo}>{`Set de ${ASAKAI_QUESTION_COUNT} questions validées`}</div>
      ) : (
        <Select
          className={classes.validationStatusSelect}
          inputProps={{
            classes: {
              icon: classes.validationStatusSelectIcon,
            },
          }}
          value={validationStatus}
          onChange={event => {
            handleValidationStatusChange(event.target.value);
          }}
        >
          {VALIDATION_STATUS_OPTIONS.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      )}
    </div>
  );
};

export default withStyles(style)(ModeSelector);
