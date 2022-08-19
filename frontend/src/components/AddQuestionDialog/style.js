import { makeStyles } from '@material-ui/core'

const useStyle = makeStyles((theme) => ({
  categoryTitle: {
    textAlign: 'center',
  },
  categorySubTitle: {
    fontSize: '12px',
    marginTop: '5px',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: '5px',
    top: '5px',
  },
  creatable: {
    fontSize: '14px',
    marginBottom: '20px',
    marginTop: '10px',
  },
  dialog: {
    [theme.breakpoints.down('sm')]: {
      padding: '20px 24px',
    },
    [theme.breakpoints.up('sm')]: {
      padding: '24px 48px',
    },
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    overflow: 'visible',
  },
  dialogTitle: {
    fontSize: '14px',
    padding: '16px 5px',
  },
  form: {
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
  },
  separatOR: {
    textAlign: 'center',
    marginBottom: 0,
  },
  option2: {
    marginBottom: '35px',
  },
  option2Wrapper: {
    display: 'flex',
    alignItems: 'baseline',
  },
  interroBang: {
    marginLeft: '10px',
  },
}))

export default useStyle
