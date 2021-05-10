import { makeStyles } from '@material-ui/core'
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

export const useOptionStyle = ({
  isChoiceMade,
  isChosenOption,
  showBar,
  ratio,
  previousRatio,
  hasSubtitle,
}: {
  isChosenOption: boolean
  isChoiceMade: boolean
  previousRatio: number
  ratio: number | null
  showBar: boolean
  hasSubtitle: boolean
}) => {
  /* eslint-disable complexity */
  const useStyles = makeStyles(() => {
    return {
      container: {
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
      },
      faded: {
        opacity: isChoiceMade && showBar && !isChosenOption ? 0.5 : undefined,
      },
      number: {
        position: 'absolute',
        left: 5,
        fontSize: '14px',
      },
      bar: {
        backgroundColor: colors.theodoGreen,
        height: '100%',
        left: 0,
        opacity: 0.8,
        position: 'absolute',
        width: `${(ratio ?? 0) * 100}%`,
        animation: `$grow 0.5s 1 ease-out`,
      },
      text: {
        zIndex: 1,
        fontSize: '20px',
      },
      textContent: {
        borderBottom: !isChoiceMade && !hasSubtitle ? '0.7px dashed' : undefined,
      },
      subtitle: {
        marginTop: '4px',
      },
      textContainer: {
        zIndex: 1,
      },
      '@keyframes grow': {
        '0%': {
          width: `${previousRatio * 100}%`,
        },
        '100%': {
          width: `${(ratio ?? 0) * 100}%`,
        },
      },
    }
  })

  return useStyles()
}
