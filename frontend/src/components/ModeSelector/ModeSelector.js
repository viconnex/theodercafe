import React from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import InfoIcon from '@material-ui/icons/Info'
import { IconButton, Tooltip } from '@material-ui/core'
import useStyle from './style'

const ModeSelector = ({ handleModeChange, isModeOn, label, tooltipContent, withMargin }) => {
  const handleSwitch = (event) => {
    handleModeChange(!!event.target.checked)
  }
  const classes = useStyle()

  const tooltipTitle = <div style={{ fontSize: '15px', padding: '8px', lineHeight: '15px' }}>{tooltipContent}</div>

  return (
    <div className={`${classes.modeSelectorContainer} ${withMargin ? classes.modeSelectorContainerMargin : ''}`}>
      <div className={classes.selectorWithInfo}>
        <FormControlLabel
          control={
            <Switch
              color="default"
              classes={{ checked: classes.switchChecked, track: classes.switchTrack }}
              checked={isModeOn}
              onChange={handleSwitch}
              value="asakai"
            />
          }
          label={label}
          classes={{ root: classes.switchControl }}
        />
        {tooltipContent && (
          <Tooltip title={tooltipTitle} enterTouchDelay={0} leaveTouchDelay={3000}>
            <IconButton color="secondary" classes={{ root: classes.infoButton }}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </div>
  )
}

export default ModeSelector
