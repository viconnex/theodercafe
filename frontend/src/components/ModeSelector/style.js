import colors from 'ui/colors';

const style = {
  modeSelectorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: '45px',
  },
  modeSelector: {
    display: 'flex',
    flexDirection: 'row',
  },
  modeSelectorInfo: {
    fontSize: '11px',
  },
  validationStatusSelect: {
    color: 'white',
    fontSize: '11px',
    fontFamily: 'Open Sans',
    '&:before': {
      borderColor: 'white',
    },
    '&:after': {
      borderColor: 'white',
    },
    marginTop: '-5px',
  },
  validationStatusSelectIcon: {
    fill: 'white',
  },

  switchChecked: {
    color: colors.theodoGreen,
  },
  switchTrack: {
    backgroundColor: 'grey',
  },
};

export default style;
