import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';

import style from './style';
import { FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';

const FilterDrawer = ({ classes, close, open, filters, handeFilterChange }) => {
  return (
    <Drawer anchor="left" open={open} onClose={close}>
      <div className={classes.drawerHeader}>
        <div>Filtres</div>
        <IconButton onClick={close}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <FormGroup className={classes.drawerContent}>
        <FormControlLabel
          control={
            <Checkbox checked={filters.isValidated} onChange={handeFilterChange('isValidated')} color="primary" />
          }
          label="Validées"
        />
        <FormControlLabel
          control={<Checkbox checked={filters.isJoke} onChange={handeFilterChange('isJoke')} color="primary" />}
          label="Blagues"
        />
      </FormGroup>
    </Drawer>
  );
};

export default withStyles(style)(FilterDrawer);
