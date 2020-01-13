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
        {filters.isValidated !== undefined && (
          <FormControlLabel
            control={
              <Checkbox checked={filters.isValidated} onChange={handeFilterChange('isValidated')} color="primary" />
            }
            label="Validées"
          />
        )}
        {filters.isNotValidated !== undefined && (
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.isNotValidated}
                onChange={handeFilterChange('isNotValidated')}
                color="primary"
              />
            }
            label="Invalidées"
          />
        )}
        {filters.isInValidation !== undefined && (
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.isInValidation}
                onChange={handeFilterChange('isInValidation')}
                color="primary"
              />
            }
            label="En attente de validation"
          />
        )}
      </FormGroup>
      <Divider />
      {(filters.isNotAnswered !== undefined || filters.isAnswered !== undefined) && (
        <React.Fragment>
          <FormGroup className={classes.drawerContent}>
            {filters.isNotAnswered !== undefined && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.isNotAnswered}
                    onChange={handeFilterChange('isNotAnswered')}
                    color="primary"
                  />
                }
                label="Pas encore répondu"
              />
            )}
            {filters.isAnswered !== undefined && (
              <FormControlLabel
                control={
                  <Checkbox checked={filters.isAnswered} onChange={handeFilterChange('isAnswered')} color="primary" />
                }
                label="Déjà répondu"
              />
            )}
          </FormGroup>
          <Divider />
        </React.Fragment>
      )}
      {(filters.isJoke !== undefined || filters.isJokeOnSomeone !== undefined) && (
        <React.Fragment>
          <FormGroup className={classes.drawerContent}>
            {filters.isJoke !== undefined && (
              <FormControlLabel
                control={<Checkbox checked={filters.isJoke} onChange={handeFilterChange('isJoke')} color="primary" />}
                label="Blagues"
              />
            )}
            {filters.isJokeOnSomeone !== undefined && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.isJokeOnSomeone}
                    onChange={handeFilterChange('isJokeOnSomeone')}
                    color="primary"
                  />
                }
                label="Blagues sur les theodoers"
              />
            )}
          </FormGroup>
        </React.Fragment>
      )}
    </Drawer>
  );
};

export default withStyles(style)(FilterDrawer);
