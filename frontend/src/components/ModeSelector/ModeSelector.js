import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Select from '@material-ui/core/Select';
import style from './style';
import MenuItem from '@material-ui/core/MenuItem';
import { FILTER_OPTIONS } from 'utils/constants/questionConstants';

const ModeSelector = ({ classes, handleModeChange, handleFilterOptionChange, isAsakaiMode, filterOption }) => {
  const handleSwitch = event => {
    handleModeChange(!!event.target.checked);
  };

  return (
    <div className={classes.modeSelectorContainer}>
      <div className={classes.modeToggle}>
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
          style={{ marginRight: '6px' }}
        />
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
