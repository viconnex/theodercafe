import { makeStyles } from '@material-ui/core'
import colors from 'ui/colors'

const useStyle = makeStyles((theme) => ({
  app: {
    backgroundColor: colors.theodoBlue,
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    fontSize: '16px',
    height: 'calc(var(--vh, 1vh) * 100)',
    textAlign: 'center',
    padding: '0px 15px',
    overflow: 'auto',
  },
  appBar: {
    background: 'white',
    height: '68px',
    display: 'flex',
    justifyContent: 'center',
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
    minHeight: '68px',
  },
}))
export default useStyle
