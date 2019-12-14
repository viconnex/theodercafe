import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Select from '@material-ui/core/Select';
import style from './style';
import MenuItem from '@material-ui/core/MenuItem';
import { FILTER_OPTIONS } from 'utils/constants/questionConstants';
import InfoIcon from '@material-ui/icons/Info';
import { IconButton, Tooltip } from '@material-ui/core';

const tooltipTitle = (
  <div style={{ fontSize: '15px', padding: '8px', lineHeight: '15px' }}>
    <div>En mode Asakai, réponds à 10 questions pour connaître ton Alterodo.</div>
    <div style={{ marginTop: '8px' }}> Les réponses ne sont pas enregsitrées.</div>
  </div>
);

const ModeSelector = ({ classes, handleModeChange, handleFilterOptionChange, isAsakaiMode, filterOption }) => {
  const handleSwitch = event => {
    handleModeChange(!!event.target.checked);
  };

  return (
    <div className={classes.modeSelectorContainer}>
      <div className={classes.selectorWithInfo}>
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
          label="Mode Asakai"
          classes={{ root: classes.switchControl }}
        />
        <Tooltip title={tooltipTitle} enterTouchDelay={0} leaveTouchDelay={3000}>
          <IconButton color="secondary" classes={{ root: classes.infoButton }}>
            <InfoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>
      {!isAsakaiMode && (
        <Select
          className={classes.filterOptionSelect}
          inputProps={{
            classes: {
              icon: classes.filterOptionSelectIcon,
            },
          }}
          value={filterOption}
          onChange={event => {
            handleFilterOptionChange(event.target.value);
          }}
        >
          {FILTER_OPTIONS.map(option => (
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
