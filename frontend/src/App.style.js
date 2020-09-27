import { makeStyles } from '@material-ui/core'
import colors from 'ui/colors'

const useStyle = makeStyles((theme) => ({
  app: {
    backgroundColor: colors.theodoBlue,
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    fontSize: '16px',
    height: '100%',
    textAlign: 'center',
    padding: '0px 15px',
  },
  appBar: {
    background: 'white',
  },
  shim: {
    marginBottom: '20px',
  },
  toolBar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  profile: {
    borderRadius: '30px',
  },
  toolbarSpace: {
    ...theme.mixins.toolbar,
  },
}))
export default useStyle
