import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';

import style from './style';
import { FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';

const FilterDrawer = ({ classes, close, open, filters, handeFilterChange }) => {
  const FilterGroup = ({ filterAttributes }) => {
    let undefinedAttributesCount = 0;
    filterAttributes.forEach(({ name: attributeName }) => {
      if (filters[attributeName] === undefined) {
        undefinedAttributesCount += 1;
      }
    });
    if (undefinedAttributesCount === filterAttributes.length) {
      return;
    }

    return (
      <React.Fragment>
        <FormGroup className={classes.drawerContent}>
          {filterAttributes.map(attribute => {
            if (filters[attribute.name] === undefined) {
              return null;
            }
            return (
              <FormControlLabel
                key={attribute.name}
                control={
                  <Checkbox
                    checked={filters[attribute.name]}
                    onChange={handeFilterChange(attribute.name)}
                    color="primary"
                  />
                }
                label={attribute.label}
              />
            );
          })}
        </FormGroup>
        <Divider />
      </React.Fragment>
    );
  };

  return (
    <Drawer anchor="left" open={open} onClose={close}>
      <div className={classes.drawerHeader}>
        <div>Filtres</div>
        <IconButton onClick={close}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <FilterGroup
        filterAttributes={[
          { name: 'isValidated', label: 'Validées' },
          { name: 'isNotValidated', label: 'Invalidées' },
          { name: 'isInValidation', label: 'En attente de validation' },
        ]}
      />
      <FilterGroup
        filterAttributes={[
          { name: 'isNotAnswered', label: 'Pas encore répondu' },
          { name: 'isAnswered', label: 'Déjà répondu' },
        ]}
      />
      <FilterGroup
        filterAttributes={[
          { name: 'isJoke', label: 'Blague' },
          { name: 'isNotJoke', label: 'Non Blagues' },
        ]}
      />
    </Drawer>
  );
};

export default withStyles(style)(FilterDrawer);
