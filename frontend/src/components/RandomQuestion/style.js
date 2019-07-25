import colors from 'ui/colors';

const style = theme => {
  return {
    pageContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    nextButton: {
      color: 'white',
    },
    addButton: {
      position: 'absolute',
      bottom: '30px',
      right: '30px',
    },
    modal: {
      padding: '30px',
    },
    optionContainer: {
      display: 'flex',
      justifyContent: 'center',
    },
    counter: {
      fontSize: '12px',
    },
    modeSelector: {
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      top: '80px',
    },
    modeSelectorInfo: {
      fontSize: '11px',
    },
    switchChecked: {
      color: colors.theodoGreen,
    },
    switchTrack: {
      backgroundColor: 'grey',
    },
  };
};

export default style;
