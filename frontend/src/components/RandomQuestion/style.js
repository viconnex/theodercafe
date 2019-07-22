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
    switch: {
      position: 'absolute',
      top: '80px',
    },
  };
};

export default style;
