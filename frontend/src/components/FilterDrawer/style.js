const style = theme => ({
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...theme.mixins.toolbar,
    padding: '0 20px',
  },
  drawerContent: {
    padding: '20px',
  },
});

export default style;
