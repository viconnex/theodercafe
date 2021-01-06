import React, { ChangeEvent } from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import InfoIcon from '@material-ui/icons/Info'
import { CircularProgress, IconButton, Tooltip } from '@material-ui/core'
import useStyle, { useTypoStyle } from './style'

const ModeSelector = ({
  handleModeChange,
  isModeOn,
  label,
  tooltipContent,
  withMargin,
  isLoading,
}: {
  isModeOn: boolean
  handleModeChange: (check: boolean) => void
  label: string
  tooltipContent: JSX.Element | null | string
  withMargin: boolean
  isLoading?: boolean
}) => {
  const handleSwitch = (event: ChangeEvent<HTMLInputElement>) => {
    handleModeChange(!!event.target.checked)
  }
  const classes = useStyle()
  const typoClasses = useTypoStyle()

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
          className={typoClasses.body1}
          classes={{ root: classes.switchControl }}
        />
        {isLoading && <CircularProgress color="secondary" size={16} className={classes.loader} />}
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
