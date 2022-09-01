import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import IconButton from '@material-ui/core/IconButton'
import Drawer from '@material-ui/core/Drawer'

import { Checkbox, FormControlLabel, FormGroup } from '@material-ui/core'
import { FormattedMessage, useIntl } from 'react-intl'
import style from './style'

const FilterGroup = ({ filterAttributes, filters, handleFilterChange, classes }) => {
  let undefinedAttributesCount = 0
  filterAttributes.forEach(({ name: attributeName }) => {
    if (filters[attributeName] === undefined) {
      undefinedAttributesCount += 1
    }
  })
  if (undefinedAttributesCount === filterAttributes.length) {
    return null
  }

  return (
    <React.Fragment>
      <FormGroup className={classes.drawerContent}>
        {filterAttributes.map((attribute) => {
          if (filters[attribute.name] === undefined) {
            return null
          }
          return (
            <FormControlLabel
              key={attribute.name}
              control={
                <Checkbox
                  checked={filters[attribute.name]}
                  onChange={(e) => handleFilterChange(attribute.name)(e.target.checked)}
                  color="primary"
                />
              }
              label={attribute.label}
            />
          )
        })}
      </FormGroup>
      <Divider />
    </React.Fragment>
  )
}
const FilterDrawer = ({ classes, close, open, filters, handleFilterChange }) => {
  const intl = useIntl()
  return (
    <Drawer anchor="left" open={open} onClose={close}>
      <div onClick={close} className={classes.drawerHeader}>
        <div>
          <FormattedMessage id="filter.title" />
        </div>
        <IconButton onClick={close}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <FilterGroup
        filters={filters}
        classes={classes}
        handleFilterChange={handleFilterChange}
        filterAttributes={[
          { name: 'isValidated', label: intl.formatMessage({ id: 'filter.validated' }) },
          { name: 'isNotValidated', label: intl.formatMessage({ id: 'filter.isNotValidated' }) },
          { name: 'isInValidation', label: intl.formatMessage({ id: 'filter.isInValidation' }) },
        ]}
      />
      <FilterGroup
        filters={filters}
        classes={classes}
        handleFilterChange={handleFilterChange}
        filterAttributes={[
          { name: 'isNotAnswered', label: intl.formatMessage({ id: 'filter.isNotAnswered' }) },
          { name: 'isAnswered', label: intl.formatMessage({ id: 'filter.isAnswered' }) },
        ]}
      />
      <FilterGroup
        filters={filters}
        classes={classes}
        handleFilterChange={handleFilterChange}
        filterAttributes={[
          { name: 'isJoke', label: intl.formatMessage({ id: 'filter.isJoke' }) },
          { name: 'isNotJoke', label: intl.formatMessage({ id: 'filter.isNotJoke' }) },
        ]}
      />
      <FilterGroup
        filters={filters}
        classes={classes}
        handleFilterChange={handleFilterChange}
        filterAttributes={[
          { name: 'isJokeOnSomeone', label: intl.formatMessage({ id: 'filter.isJokeOnSomeone' }) },
          { name: 'isNotJokeOnSomeone', label: intl.formatMessage({ id: 'filter.isNotJokeOnSomeone' }) },
        ]}
      />
      <Divider />
      <FilterGroup
        filters={filters}
        classes={classes}
        handleFilterChange={handleFilterChange}
        filterAttributes={[{ name: 'isMBTI', label: intl.formatMessage({ id: 'filter.isMBTI' }) }]}
      />
    </Drawer>
  )
}

export default withStyles(style)(FilterDrawer)
