import { makeStyles, Theme } from '@material-ui/core'
import colors from 'ui/colors'

const useStyle = makeStyles(() => {
  return {
    categoryContainer: {
      marginBottom: '24px',
    },
    categoryTitle: {
      fontSize: '16px',
      marginBottom: '7px',
    },
    categoryContent: {
      backgroundColor: colors.theodoGreen,
      fontStyle: 'italic',
    },
    separator: {
      marginTop: '8px',
      marginBottom: '8px',
    },
    pageContainer: {
      marginTop: '30px',
    },
  }
})

export default useStyle

export const useOptionStyle = makeStyles<
  Theme,
  { isChosenOption: boolean; isChoiceMade: boolean; ratio: number | null; showBar: boolean }
>(() => {
  return {
    container: ({ isChoiceMade, isChosenOption, showBar }) => ({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: showBar ? '88%' : undefined,
      maxWidth: '500px',
      cursor: 'pointer',
      position: 'relative',
      border: isChoiceMade && (showBar || isChosenOption) ? '0.5px solid white' : undefined,
      minHeight: '40px',
      padding: '8px 20px',
      opacity: isChoiceMade && showBar && !isChosenOption ? 0.5 : undefined,
    }),
    number: {
      position: 'absolute',
      left: 5,
      fontSize: '14px',
    },
    bar: (props) => ({
      backgroundColor: colors.theodoGreen,
      opacity: 0.8,
      position: 'absolute',
      height: '100%',
      width: `${(props.ratio ?? 0) * 100}%`,
      left: 0,
    }),
    text: ({ isChoiceMade }) => ({
      borderBottom: !isChoiceMade ? '0.7px dashed' : undefined,
      zIndex: 1,
      fontSize: '20px',
    }),
    textContainer: {
      zIndex: 1,
    },
  }
})
