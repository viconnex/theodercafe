import colors from 'ui/colors';

const style = {
  modeSelectorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  modeSelector: {
    display: 'flex',
    flexDirection: 'row',
  },
  modeSelectorInfo: {
    fontSize: '12px',
  },
  filterOptionSelect: {
    color: 'white',
    fontSize: '12px',
    fontFamily: 'Open Sans',
    '&:before': {
      borderColor: 'white',
    },
    '&:after': {
      borderColor: 'white',
    },
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
