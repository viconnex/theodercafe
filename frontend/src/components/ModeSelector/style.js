import colors from 'ui/colors';

const style = {
  modeSelectorContainer: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: 0,
  },
  selectorWithInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  infoButton: {
    padding: '8px',
  },
  switchControl: {
    marginRight: '0',
  },
  modeInfo: {
    fontSize: '10px',
    alignSelf: 'center',
    fontStyle: 'italic',
    textAlign: 'left  ',
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
    fontSize: '14px',
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
