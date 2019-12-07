import colors from 'ui/colors';

const style = {
  modeSelectorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: '40px',
  },
  modeSelector: {
    display: 'flex',
    flexDirection: 'row',
  },
  modeSelectorInfo: {
    fontSize: '11px',
  },
  filterOptionSelect: {
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
  filterOptionSelectIcon: {
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
