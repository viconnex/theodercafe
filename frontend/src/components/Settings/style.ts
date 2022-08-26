import { makeStyles } from '@material-ui/core'
import colors from 'ui/colors'

export const useSettingsStyle = makeStyles(() => ({
  page: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    alignItems: 'center',
    position: 'relative',
    padding: '20px',
  },
  container: {
    display: 'flex',
    backgroundColor: colors.white,
    width: '100%',
    height: '100%',
    padding: '20px',
    color: colors.theodoBlue,
  },
}))

export const useSelectSetStyle = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: ' 100%',
  },
}))
