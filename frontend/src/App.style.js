import colors from 'ui/colors';

const style = {
  app: {
    backgroundColor: colors.theodoBlue,
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    fontSize: 'calc(10px + 2vmin)',
    justifyContent: 'center',
    minHeight: '100vh',
    textAlign: 'center',
    padding: '0px 15px',
  },
  appBar: {
    background: 'white',
  },
  toolBar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
};

export default style;
